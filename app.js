'use strict';

const outputPrevious = document.querySelector('.calc__output-previous');
const outputCurrent = document.querySelector('.calc__output-current');
const outputOperator = document.querySelector('.calc__operator');
const operationsButtons = document.querySelectorAll('.calc__key--operation');
const numbersButtons = document.querySelectorAll('.calc__key--number');

class Calculator {
	constructor(outputPrevious, outputCurrent, outputOperator, operationsButtons, numbersButtons) {
		this.outputPrevious = outputPrevious;
		this.outputCurrent = outputCurrent;
		this.outputOperator = outputOperator;
		this.operationsButtons = operationsButtons;
		this.numbersButtons = numbersButtons;
		this.state = {
			current: '',
			previous: '',
			operation: '',
		};

		this.init();
	}

	init() {
		this.operationsButtons.forEach(button => {
			button.addEventListener('click', e => {
				const value = e.target.innerText;
				this.operationsRoutes(value);
			});
		});
		this.numbersButtons.forEach(button => {
			button.addEventListener('click', e => {
				const value = e.target.innerText;
				// console.log(`Number: ${value}`);
				this.appendDigit(value);
			});
		});
	}

	operationsRoutes(operation) {
		// Delete last digit
		if (operation === 'DEL') {
			this.deleteLastDigit();
			this.playAudio('baka');
		}

		// Delete All
		else if (operation === 'C') {
			this.clearAll();
			this.playAudio('anta-baka');
		}

		// Equal
		else if (operation === '=') {
			this.equals();
			this.playAudio('onichan-daisuki');
		}

		// Basic Operations
		else {
			// Method to move/change operator if there is not
			this.checkOperator(operation);

			switch (operation) {
				case '+':
					this.sum();
					this.playAudio('aaah');
					break;
				case '-':
					this.subtract();
					break;
				case '*':
					this.multiply();
					break;
				case '/':
					this.divide();
					break;
				case '%':
					this.percentage();
					break;
				default:
					return;
			}
		}
	}

	// UI
	updateUI() {
		this.outputCurrent.innerText = this.state.current;
		this.outputPrevious.innerText = this.state.previous;
		this.outputOperator.innerText = this.state.operation;
	}

	playAudio(audioName) {
		const sound = new Audio(`./audios/${audioName}.mp3`);
		sound.play();
	}

	// State

	appendDigit(digit) {
		if (digit === '.' && this.state.current.includes('.')) return;
		this.state.current += digit;
		this.updateUI();

		if (this.state.current.length >= 15 && this.state.current.length <= 20) {
			this.playAudio('aaah');
		} else if (this.state.current.length > 20) {
			this.playAudio('yametekudasai');
		}
	}

	checkOperator(operation) {
		// Situation 2, there is no previous value: current value is moved to previous and operator is set.
		if (this.state.previous === '') {
			console.log('Entrando na condição');

			this.state.previous = this.state.current;
			this.state.operation = operation;
			this.state.current = '';
			this.updateUI();
			console.log(this.state);
			console.log('UI atualizada');
			return;
		}

		// Situation 3, there is a previous number and an operator, if the operator different than = he is changed.
		if (this.state.current === '') {
			if (operation === '=') return;

			this.state.operation = operation;
			this.updateUI();
		}
	}

	// Calculator Operations
	sum() {
		const sum = Number(this.state.current) + Number(this.state.previous);
		if (this.state.current !== '') {
			this.state.operation = '+';
			this.state.previous = sum;
			this.state.current = '';
		}
		this.updateUI();
	}

	subtract() {
		if (this.state.previous === '' && this.state.current === '') {
			this.state.current = '-';
			this.updateUI();
			return;
		}
		const subtraction = Number(this.state.previous) - Number(this.state.current);
		if (this.state.current !== '') {
			this.state.operation = '-';
			this.state.previous = subtraction;
			this.state.current = '';
		}
		this.updateUI();
	}

	divide() {
		console.log('Division');
		if (this.state.current !== '') {
			const value = Number(this.state.previous) / Number(this.state.current);
			this.state.operation = '/';
			this.state.previous = value;
			this.state.current = '';
			console.log('Resultado da divisão', value);
		}
		this.updateUI();
	}

	multiply() {
		console.log('Division');
		if (this.state.current !== '') {
			const value = Number(this.state.previous) * Number(this.state.current);
			this.state.operation = '*';
			this.state.previous = value;
			this.state.current = '';
			console.log('Resultado da multiplicação', value);
		}
		this.updateUI();
	}

	percentage() {
		console.log('Division');
		if (this.state.current !== '') {
			const value = Number(this.state.previous) * (Number(this.state.current) / 100);
			this.state.operation = '';
			this.state.previous = value;
			this.state.current = '';
			console.log('Resultado da divisão', value);
		}
		this.updateUI();
	}

	equals() {
		console.log('Equal operation');
		this.operationsRoutes(this.state.operation);
		this.state.current = this.state.previous.toString();
		this.state.previous = '';
		this.state.operation = '';
		console.log(this.state);
		this.updateUI();
	}

	deleteLastDigit() {
		if (this.state.current === '') return;
		this.state.current = this.state.current.slice(0, -1);
		this.updateUI();
	}

	clearAll() {
		this.state.current = '';
		this.state.previous = '';
		this.state.operation = '';
		this.updateUI();
	}
}

// Initializing the object
const calc = new Calculator(
	outputPrevious,
	outputCurrent,
	outputOperator,
	operationsButtons,
	numbersButtons
);
