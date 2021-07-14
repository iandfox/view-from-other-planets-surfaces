/**
 * CheatCodes
 *     Hide advanced functionality behind keyboard shortcuts.
 *
 *     If you have found this file / comment and weren't directed to it, congratulations! See me for a prize :)
 *
 *     Usage:
 *         Within a vue component's setup:   const cheatcodes = reactive(new CheatCodes());
 *                                           provide('cheatcodes', cheatcodes);
 *         Check for an active cheat:
 *             Within a Vue template:        <p>konami is {{cheatcodes.check('konami') ? 'active' : 'not active'}}</p>
 *             Within javascript:            const isKonamiActive = cheatcodes.check.value('konami'); // = true/false
 *                                               // this is important! the function itself is a `ref` so you need to
 *                                               // use its `.value` when calling from JS
 *         Get the current string of typed keys:
 *             Within a Vue template:        <p>Current keys are: {{cheatcodes.current()}}</p>
 *             Within javascript:            const currentKeys = cheatcodes.current.value(); // = "up up a b a b"
 *                                               // this is important! See comment for active cheat, above.
 *
 * @version 1.0.0 - 2021-07-14
 * @since 2021-07-14
 * @created 2021-07-14
 */

import { ref } from 'vue';

class CheatCodes {
	/**
	 * @since 2021-07-14
	 *
	 * @param {Boolean} isSilent Whether messages e.g. for cheats being activated are logged
	 */
	constructor(isSilent = false) {
		this.isSilent = isSilent;
		
		// Array of string values for the keys that have been pressed
		this.keysTyped = ref([]);
		this.activeCheats = ref({});
		
		this.maxTrackedKeys = 11;
		
		this.cheats = {
			'esc esc esc esc': {
				name: 'turn off cheats',
				cb: () => { this.keepListening = false },
			},
			'up up down down left right left right b a': {
				name: 'konami',
				cb: (cheatName) => {},
			},
			'm o t h e r l o d e': {
				name: 'sims',
				cb: (cheatName) => {},
			},
			'i d d q d': {
				name: 'godmode',
				cb: (cheatName) => {},
			},
			'i d k f a': {
				name: 'allweapons',
				cb: (cheatName) => {},
			},
			'x y z z y': { // from Colossal Cave Adventure
				name: 'adventure',
				cb: (cheatName) => {},
			}
		};
		
		// We can't directly "clear" an event listener, so this flag will be checked within handler to cease
		this.keepListening = false;
		
		// Begin listening for cheats
		this._startListening();
		
		///
		/// Reactive methods
		///
		/**
		 * Check to see if a cheat is activated
		 *
		 * Usage:
		 *     cheatcodes.check('konami') // = false
		 *
		 * @since 2021-07-14
		 *
		 * @param cheatName
		 * @return {boolean}
		 */
		this.check = (cheatName) => !! this.activeCheats.value[cheatName];
		
		/**
		 * The current string of tracked keys that have been pressed
		 *
		 * @since 2021-07-14
		 *
		 * @return {string}
		 */
		this.current = () => this._toCode(this.keysTyped.value).code;
	}
	
	
	///
	/// Private methods for class functionality. Don't need to be called outside of the class.
	///
	
	/**
	 * Listen to key events
	 *
	 * @since 2021-07-14
	 * @private
	 */
	_startListening() {
		this.keepListening = true;
		
		window.addEventListener('keyup', (event) => this._keyUpHandler(event));
	}
	
	/**
	 * KeyUp handler abstracted into a likely-unnecessary method in order to more easily remove the event listener
	 *
	 * @since 2021-07-14
	 *
	 * @param event
	 * @private
	 */
	_keyUpHandler(event) {
		this._addTypedKey(event.key);
		
		if (! this.keepListening) {
			if (! this.isSilent) { console.log('Cheat codes have been disabled') }
			window.removeEventListener('keyup', (event) => this._keyUpHandler(event));
		}
	}
	
	
	/**
	 * @since 2021-07-14
	 *
	 * @param {string} key
	 * @private
	 */
	_addTypedKey(key) {
		this.keysTyped.value.push(key);
		
		if (this.keysTyped.value.length > this.maxTrackedKeys) {
			this.keysTyped.value.shift();
		}
		
		this._checkCheats();
	}
	
	
	/**
	 * Checks all cheats to see if they should get activated/deactivated.
	 *
	 * Cheat code combination conflicts/overlapping is not handled. Just make distinct codes, instead.
	 *
	 * @since 2021-07-14
	 * @private
	 */
	_checkCheats() {
		let current = this.current();
		Object.keys(this.cheats).forEach((code) => {
			if (current.indexOf(code) !== -1) {
				this._toggleCheat(code);
				
				// Clear out the current keys typed, so that we don't activate-deactivate on next key press
				this.keysTyped.value = [];
				
				// Clear out the code from `current` so we don't double-recognize codes.
				current = current.replace(code, '');
			}
		});
	}
	
	
	/**
	 * @since 2021-07-14
	 *
	 * @param {string} code
	 * @return {Boolean} The current state (true/false) of the cheat code
	 * @private
	 */
	_toggleCheat(code) {
		const cheat = this.cheats[code].name;
		this.activeCheats.value[cheat] = ! this.activeCheats.value[cheat];
		
		if (! this.isSilent) {
			console.log(`Cheat "${cheat}" ${this.activeCheats.value[cheat] ? 'activated' : 'deactivated'} (code: '${code}')`);
		}
		
		if (this.activeCheats.value[cheat]) {
			if (this.cheats[code].cb) {
				this.cheats[code].cb(cheat);
			}
		}
		
		return this.activeCheats.value[cheat];
	}
	
	
	/**
	 * Converts an array of keys (i.e., strings for keys) to a cheat code string.
	 *
	 * Example:
	 *     _toCode(["ArrowUp", "f", "a", "Enter"]) // = "up f a"
	 *
	 * @since 2021-07-14
	 *
	 * @param  {string[]} keysArray
	 * @return {{code: string, raw: any[]}}
	 * @private
	 */
	_toCode(keysArray = []) {
		const raw = keysArray.map((key) => {
			switch (key) {
				case 'ArrowUp':
				case 'ArrowDown':
				case 'ArrowLeft':
				case 'ArrowRight':
					return key.replace('Arrow', '').toLowerCase();
				case 'Escape':
					return 'esc';
				default:
					return key.toLowerCase();
			}
		});
		
		const code = raw.join(' ');
		
		return {code, raw};
	}
}

export {
	CheatCodes
}
