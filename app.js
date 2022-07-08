'use strict';

const objectUI = {
	outputPrevious: document.querySelector('.calc__output-previous'),
	outputCurrent: document.querySelector('.calc__output-current'),
	outputOperator: document.querySelector('.calc__operator'),
	operationsButtons: document.querySelectorAll('.calc__key--operation'),
	numbersButtons: document.querySelectorAll('.calc__key--number'),
};

class Calculator {
	constructor(objectUI) {
		// Inputs that are accepted by the calculator
		this.acceptableOperators = ['+', '-', '*', '/', '%', '÷'];
		this.acceptableFunctionalities = ['DEL', 'Delete', 'Backspace', 'Enter', 'C', 'c', '='];
		this.acceptableNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];

		// Linking the calculator with the UI
		this.outputPrevious = objectUI.outputPrevious;
		this.outputCurrent = objectUI.outputCurrent;
		this.outputOperator = objectUI.outputOperator;
		this.operationsButtons = objectUI.operationsButtons;
		this.numbersButtons = objectUI.numbersButtons;

		// Internal state to facilitate the data flow
		this.state = {
			current: '',
			previous: '',
			operation: '',
		};

		// Adding Event Handlers to receive inputs from the user
		this.addClickEventHandler();
		this.addKeydownEventHandler();
	}

	/**
	 * ================================================
	 * =============== EVENT HANDLERS =================
	 * ================================================
	 *
	 * Functions responsible for add events to receive the
	 * inputs from the user, ignore the unwanted inputs
	 * and send the right ones to the right controller.
	 *
	 */

	addClickEventHandler() {
		this.operationsButtons.forEach(button => {
			button.addEventListener('click', e => {
				const value = e.target.innerText;
				if (this.acceptableFunctionalities.includes(value)) {
					this.calcFunctionalitiesController(value);
				}
				if (this.acceptableOperators.includes(value)) {
					this.mathOperationsController(value);
				}
			});
		});
		this.numbersButtons.forEach(button => {
			button.addEventListener('click', e => {
				const value = e.target.innerText;

				if (this.acceptableNumbers.includes(value)) {
					this.appendDigit(value);
				}
			});
		});
	}

	addKeydownEventHandler() {
		document.addEventListener('keydown', event => {
			const keyName = event.key;
			const allAcceptableInputs = [
				...this.acceptableNumbers,
				...this.acceptableFunctionalities,
				...this.acceptableOperators,
			];
			// Stop if the key isn't one of the expected
			if (!allAcceptableInputs.includes(keyName)) {
				this.playAudio('iranai');
				return;
			}

			// Element that will receive hover effect
			let hoveredButtton;

			// Adding hover effect on the respective button
			[...this.numbersButtons, ...this.operationsButtons].forEach(button => {
				if (
					(keyName === 'Delete' && button.innerText === 'DEL') ||
					(keyName === 'Backspace' && button.innerText === 'DEL')
				) {
					button.classList.add('active');
					hoveredButtton = button;
				} else if (
					(keyName === 'Enter' && button.innerText === '=') ||
					(keyName === '=' && button.innerText === '=')
				) {
					button.classList.add('active');
					hoveredButtton = button;
				} else if (keyName === '/' && button.innerText === '÷') {
					button.classList.add('active');
					hoveredButtton = button;
				} else if (keyName === 'c' && button.innerText === 'C') {
					button.classList.add('active');
					hoveredButtton = button;
				} else if (button.innerText === keyName) {
					button.classList.add('active');
					hoveredButtton = button;
				}
			});
			// Removing the hoover effect
			setTimeout(() => {
				hoveredButtton.classList.remove('active');
			}, 250);

			// Sending the keyName to the right controller
			if (this.acceptableNumbers.includes(keyName)) {
				this.appendDigit(keyName);
			}
			if (this.acceptableOperators.includes(keyName)) {
				this.mathOperationsController(keyName);
			}
			if (this.acceptableFunctionalities.includes(keyName)) {
				this.calcFunctionalitiesController(keyName);
			}
		});
	}

	/**
	 * ================================================
	 * ================= CONTROLLERS ==================
	 * ================================================
	 *
	 * Functions responsible for making pre-validations
	 * and calling the right math operation and/or execute
	 * the right calculator functionality.
	 *
	 */

	/**
	 * Receive the operator and after validations call the right
	 * math operation.
	 * @param {String} operation
	 */
	mathOperationsController(operation) {
		// Stopping operators when there is no values declared, exception is subtraction.
		if (this.state.current === '' && this.state.previous === '' && operation !== '-') {
			this.playAudio('error');
			return;
		}

		// Block the possibility of adding multiple operators in the canculator
		if (this.state.current === '-') {
			this.playAudio('error');
			return;
		}

		// Changing operators when already there is one.
		if (this.state.current === '' && this.state.previous !== '') {
			this.updateState(this.state.previous, '', operation);
			return;
		}
		this.playAudio('click');

		switch (operation) {
			case '+':
				if (this.isPreviousEmptyChecker(operation)) break;
				this.sum();
				break;
			case '-':
				// Adds a negative number when there is no number declared in the current field.
				if (this.state.current === '' && this.state.previous === '') {
					this.updateState('', '-', '');
					break;
				}
				if (this.isPreviousEmptyChecker(operation)) break;
				this.subtract();
				break;
			case '/':
			case '÷':
				if (this.isPreviousEmptyChecker('÷')) break;
				this.divide();
				break;
			case '*':
				if (this.isPreviousEmptyChecker(operation)) break;
				this.multiply();
				break;
			case '%':
				if (this.isPreviousEmptyChecker(operation)) break;
				this.percentage();
				break;
			default:
				return;
		}
	}

	/**
	 * Responsible for calling the calculator actions
	 * that don't involve math operations.
	 * @param {String} operation
	 */
	calcFunctionalitiesController(operation) {
		switch (operation) {
			case 'C':
			case 'c':
				this.clearAll();
				this.playAudio('baka-baka');
				break;
			case 'DEL':
			case 'Delete':
			case 'Backspace':
				this.deleteLastDigit();
				this.playAudio('baka');
				break;
			case '=':
			case 'Enter':
				if (this.state.previous === '') {
					this.playAudio('error');
					break;
				}

				this.mathOperationsController(this.state.operation);
				this.updateState('', this.state.previous, '');

				if (this.state.current === '') return;
				this.playAudio('kansha');
				break;
			default:
				return;
		}
	}

	/**
	 * ================================================
	 * ======== CALCULATOR FUNCTIONALITIES ============
	 * ================================================
	 */

	/**
	 * Updating the state of the application and calling the
	 * updateUI to render the new values on the interface.
	 *
	 * @param {String} previous
	 * @param {String} current
	 * @param {String} operation
	 */
	updateState(
		previous = this.state.previous,
		current = this.state.current,
		operation = this.state.operation
	) {
		this.state.previous = previous.toString();
		this.state.current = current.toString();
		this.state.operation = operation.toString();

		this.updateUI();
	}

	/**
	 * Render the values of the state in the UI.
	 * Called automatically by the function updateState.
	 */
	updateUI() {
		this.outputCurrent.innerText = this.state.current;
		this.outputPrevious.innerText = this.state.previous;
		this.outputOperator.innerText = this.state.operation;
	}

	/**
	 * Receives a number from the UI in the form of String and adds to
	 * the current number. Also plays a sound when finished.
	 * @param {String} digit
	 */
	appendDigit(digit) {
		if (digit === '.' && this.state.current.includes('.')) {
			this.playAudio('error');
			return;
		}
		this.state.current += digit;
		this.playAudio('click');
		this.updateState();

		if (this.state.current.length >= 15 && this.state.current.length <= 20) {
			this.playAudio('aaah');
		} else if (this.state.current.length > 20) {
			this.playAudio('yametekudasai');
		}
	}

	/**
	 * Check if the previous field is empty, if it is true the current value
	 * is moved to the previous field and the operator is set.
	 * @param {String} operator
	 * @returns true or false
	 */
	isPreviousEmptyChecker(operator) {
		if (this.state.previous === '') {
			this.updateState(this.state.current, '', operator);
			return true;
		}
		return false;
	}

	/**
	 * Deletes the last digit in the current field.
	 */
	deleteLastDigit() {
		if (this.state.current === '') return;
		this.state.current = this.state.current.slice(0, -1);
		this.updateState();
	}

	/**
	 * Reset the state and the UI to the initial state.
	 */
	clearAll() {
		this.updateState('', '', '');
	}

	/**
	 * Receives a sound name and play the respective funny sound.
	 * @param {String} audioName
	 */
	playAudio(audioName) {
		const sound = new Audio(`./audios/${audioName}.mp3`);
		sound.play();
	}

	/**
	 * ================================================
	 * ============== MATH OPERATIONS =================
	 * ================================================
	 */

	sum() {
		const sum = Number(this.state.current) + Number(this.state.previous);
		this.updateState(sum, '', '+');
	}

	subtract() {
		const subtraction = Number(this.state.previous) - Number(this.state.current);
		this.updateState(subtraction, '', '-');
	}

	divide() {
		const value = Number(this.state.previous) / Number(this.state.current);
		this.updateState(value, '', '÷');
	}

	multiply() {
		const value = Number(this.state.previous) * Number(this.state.current);
		this.updateState(value, '', '*');
	}

	percentage() {
		const value = (Number(this.state.previous) * Number(this.state.current)) / 100;
		this.updateState(value, '', '%');
	}
}

// Initializing the calculator object
const calc = new Calculator(objectUI);
