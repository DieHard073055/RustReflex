class RustReflex {
    constructor() {
        this.db = null;
        this.currentQuestion = null;
        this.currentMode = null;
        this.score = 0;
        this.streak = 0;
        this.masteryScores = {
            basics: 0,
            ownership: 0,
            advanced: 0
        };
        this.questions = [];
        this.isLoading = false;
        this.init();
    }

    async init() {
        this.showLoading(true);
        await this.initDB();
        await this.loadQuestions();
        this.setupEventListeners();
        this.updateUI();
        this.showLoading(false);
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('RustReflexDB', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('questions')) {
                    const store = db.createObjectStore('questions', { keyPath: 'id' });
                    store.createIndex('category', 'category', { unique: false });
                    store.createIndex('difficulty', 'difficulty', { unique: false });
                    store.createIndex('dateAdded', 'dateAdded', { unique: false });
                }
                if (!db.objectStoreNames.contains('stats')) {
                    db.createObjectStore('stats', { keyPath: 'id' });
                }
            };
        });
    }

    async loadQuestions() {
        try {
            const response = await fetch('data/questions.json');
            const data = await response.json();
            this.questions = data;
            await this.saveQuestionsToDB(data);
        } catch (error) {
            console.log('Using cached questions from DB');
            const transaction = this.db.transaction(['questions'], 'readonly');
            const store = transaction.objectStore('questions');
            const request = store.getAll();
            
            request.onsuccess = () => {
                this.questions = request.result;
            };
        }
    }

    async saveQuestionsToDB(questions) {
        const transaction = this.db.transaction(['questions'], 'readwrite');
        const store = transaction.objectStore('questions');
        
        questions.forEach(question => {
            store.put(question);
        });
    }

    setupEventListeners() {
        document.getElementById('mode-a').addEventListener('click', () => this.startMode('spot-error'));
        document.getElementById('mode-b').addEventListener('click', () => this.startMode('predict-output'));
        document.getElementById('mode-c').addEventListener('click', () => this.startMode('fix-syntax'));
        document.getElementById('next-question').addEventListener('click', () => this.loadNextQuestion());
        document.getElementById('sync-data').addEventListener('click', () => this.syncData());
    }

    startMode(mode) {
        this.currentMode = mode;
        document.getElementById('mode-selector').classList.add('hidden');
        document.getElementById('game-area').classList.remove('hidden');
        this.loadNextQuestion();
    }

    loadNextQuestion() {
        let questionType;
        switch(this.currentMode) {
            case 'spot-error':
                questionType = 'spot_error';
                break;
            case 'predict-output':
                questionType = 'predict_output';
                break;
            case 'fix-syntax':
                questionType = 'fix_syntax';
                break;
        }
        
        const availableQuestions = this.questions.filter(q => 
            q.question_type === questionType
        );
        
        const availableQuestions = this.questions.filter(q => 
            q.question_type === questionType
        );
        
        if (availableQuestions.length === 0) {
            this.showNoQuestions();
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        this.currentQuestion = availableQuestions[randomIndex];
        this.displayQuestion();
    }

    displayQuestion() {
        const codeSnippet = document.getElementById('code-snippet');
        codeSnippet.textContent = this.currentQuestion.code_snippet.join('\n');
        Prism.highlightElement(codeSnippet);
        
        const questionContent = document.getElementById('question-content');
        let questionText = '';
        
        switch (this.currentMode) {
            case 'spot-error':
                questionText = 'Identify the exact line causing the error and select the reason:';
                break;
            case 'predict-output':
                questionText = 'Predict what this code will output:';
                break;
            case 'fix-syntax':
                questionText = 'Select the correct syntax to fix this code:';
                break;
        }
        
        questionContent.textContent = questionText;
        this.displayAnswerOptions();
    }

    displayAnswerOptions() {
        const answerArea = document.getElementById('answer-area');
        answerArea.innerHTML = '';
        
        if (this.currentMode === 'spot-error') {
            this.displayErrorOptions();
        } else if (this.currentMode === 'predict-output') {
            this.displayOutputOptions();
        } else if (this.currentMode === 'fix-syntax') {
            this.displayFixOptions();
        }
    }

    displayErrorOptions() {
        const answerArea = document.getElementById('answer-area');
        
        this.currentQuestion.choices.forEach((choice, index) => {
            const option = document.createElement('div');
            option.className = 'answer-option';
            option.textContent = `${index + 1}. ${choice}`;
            option.dataset.choice = index;
            option.addEventListener('click', () => this.checkErrorAnswer(index));
            answerArea.appendChild(option);
        });
    }

    displayOutputOptions() {
        const answerArea = document.getElementById('answer-area');
        
        const options = [
            'Option A: ' + this.generateRandomOutput(),
            'Option B: ' + this.generateRandomOutput(),
            'Option C: ' + this.generateRandomOutput(),
            'Option D: ' + this.generateRandomOutput()
        ];
        
        options[this.currentQuestion.correct_answer] = 'Option ' + 
            String.fromCharCode(65 + this.currentQuestion.correct_answer) + 
            ': ' + this.currentQuestion.correct_output;
        
        options.forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.className = 'answer-option';
            optionEl.textContent = option;
            optionEl.dataset.choice = index;
            optionEl.addEventListener('click', () => this.checkOutputAnswer(index));
            answerArea.appendChild(optionEl);
        });
    }

    displayFixOptions() {
        const answerArea = document.getElementById('answer-area');
        
        const fixOptions = ['&mut', '&', '*', 'ref'];
        fixOptions[this.currentQuestion.correct_answer] = this.currentQuestion.correct_fix;
        
        fixOptions.forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.className = 'answer-option';
            optionEl.textContent = option;
            optionEl.dataset.choice = index;
            optionEl.addEventListener('click', () => this.checkFixAnswer(index));
            answerArea.appendChild(optionEl);
        });
    }

    generateRandomOutput() {
        const outputs = ['Some(10)', 'None', 'Panic', 'Error', '42', '"hello"', 'true', 'false'];
        return outputs[Math.floor(Math.random() * outputs.length)];
    }

    checkErrorAnswer(selectedIndex) {
        const isCorrect = selectedIndex === this.currentQuestion.correct_line_index;
        this.showAnswerResult(isCorrect);
        
        if (isCorrect) {
            this.score += 10;
            this.streak++;
            this.updateMasteryScore('basics');
        } else {
            this.streak = 0;
        }
        
        this.updateUI();
    }

    checkOutputAnswer(selectedIndex) {
        const isCorrect = selectedIndex === this.currentQuestion.correct_answer;
        this.showAnswerResult(isCorrect);
        
        if (isCorrect) {
            this.score += 15;
            this.streak++;
            this.updateMasteryScore('ownership');
        } else {
            this.streak = 0;
        }
        
        this.updateUI();
    }

    checkFixAnswer(selectedIndex) {
        const isCorrect = selectedIndex === this.currentQuestion.correct_answer;
        this.showAnswerResult(isCorrect);
        
        if (isCorrect) {
            this.score += 20;
            this.streak++;
            this.updateMasteryScore('advanced');
        } else {
            this.streak = 0;
        }
        
        this.updateUI();
    }

    showAnswerResult(isCorrect) {
        const options = document.querySelectorAll('.answer-option');
        options.forEach((option, index) => {
            if (index === this.currentQuestion.correct_answer) {
                option.classList.add('correct');
            } else if (!isCorrect && index === parseInt(option.dataset.choice)) {
                option.classList.add('incorrect');
            }
        });
    }

    updateMasteryScore(category) {
        this.masteryScores[category] = Math.min(100, this.masteryScores[category] + 5);
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('streak').textContent = this.streak;
        this.updateMasteryBars();
    }

    updateMasteryBars() {
        const masteryBars = document.getElementById('mastery-bars');
        masteryBars.innerHTML = '';
        
        Object.entries(this.masteryScores).forEach(([category, score]) => {
            const bar = document.createElement('div');
            bar.className = 'mastery-bar';
            
            const label = document.createElement('div');
            label.className = 'mastery-label';
            label.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            
            const progress = document.createElement('div');
            progress.className = 'mastery-progress';
            
            const fill = document.createElement('div');
            fill.className = 'mastery-fill';
            fill.style.width = `${score}%`;
            
            progress.appendChild(fill);
            bar.appendChild(label);
            bar.appendChild(progress);
            masteryBars.appendChild(bar);
        });
    }

    showNoQuestions() {
        const questionContent = document.getElementById('question-content');
        questionContent.textContent = 'No questions available for this mode. Try syncing data or selecting a different mode.';
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }

    async syncData() {
        try {
            const lastSync = await this.getLastSyncTime();
            const response = await fetch(`/api/updates?since=${lastSync}`);
            const updates = await response.json();
            
            if (updates.length > 0) {
                await this.saveQuestionsToDB(updates);
                this.questions = [...this.questions, ...updates];
                this.setLastSyncTime(Date.now());
                alert('Data synced successfully!');
            } else {
                alert('No new updates available.');
            }
        } catch (error) {
            console.log('Sync failed, using offline data');
            alert('Sync failed. Using offline data.');
        }
    }

    async getLastSyncTime() {
        return new Promise((resolve) => {
            const transaction = this.db.transaction(['stats'], 'readonly');
            const store = transaction.objectStore('stats');
            const request = store.get('lastSync');
            
            request.onsuccess = () => {
                resolve(request.result?.value || 0);
            };
        });
    }

    async setLastSyncTime(timestamp) {
        return new Promise((resolve) => {
            const transaction = this.db.transaction(['stats'], 'readwrite');
            const store = transaction.objectStore('stats');
            store.put({ id: 'lastSync', value: timestamp });
            resolve();
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RustReflex();
});