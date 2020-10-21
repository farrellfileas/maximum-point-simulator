"use strict";

(function() {
	let k;
	let cardPoints;
	let handIndex;
	let points;
	let left;
	let right;

	window.addEventListener('load', init);

	function init() {
		qs('#submit').addEventListener('click', () => {populatePlayground(false);});
		qs('#reset').addEventListener('click', () => {populatePlayground(true);});
		qs("#bruteforce").addEventListener('click', bruteforce);
		qs("#activity").addEventListener('click', () => {qs('.logs').classList.toggle('d-none');});
	}

	function populatePlayground(reset) {
		if (!reset) {
			k = parseInt(qs('#k').value);
			cardPoints = qs('#cardPoint').value;
		

			let error = qs('.text-danger');

			if (cardPoints.charAt(0) == '[' && cardPoints.charAt(cardPoints.length - 1) == ']') {
				cardPoints = cardPoints.substring(1, cardPoints.length - 1).split(',');
			} else if (cardPoints.charAt(0) == '[' || cardPoints.charAt(cardPoints.length - 1) == ']') {
				error.textContent = "Cannot parse cardPoints array, are you missing an open/closing brace?";
				error.classList.remove('d-none');

				qs('.playground-wrapper').classList.add('d-none');
				return;
			}
			
			if (k > cardPoints.length || k <= 0) {
				error.textContent = "Make sure that 0 < K < cardPoints.length.";
				error.classList.remove('d-none');
				qs('.playground-wrapper').classList.add('d-none');

				return;
			}

			for (let i = 0; i < cardPoints.length; i++) {
				let temp = parseInt(cardPoints[i]);
				if (isNaN(temp)) {
					error.textContent = "\'" + cardPoints[i] + "\' could not be converted into an integer";
					error.classList.remove('d-none');
					qs('.playground-wrapper').classList.add('d-none');

					return;
				}
				cardPoints[i] = temp;
			}

			error.classList.add('d-none');
		}
		let playground = qs('.cardPoints');
		let hand = qs('.hand');
		playground.innerHTML = "";
		hand.innerHTML = "";
		handIndex = 0;
		points = 0;
		qs('#current-point').textContent = points;
		qs('#maximum-point').textContent = points;
		left = 0;
		right = cardPoints.length - 1;
		qs('.playground-wrapper').classList.remove('d-none');
		qs('#logs').innerHTML = "";
		qs('.logs').classList.add('d-none');
		qs("#actions-taken").textContent = '0';

		$('html, body').animate({
	        scrollTop: $(".playground-wrapper").offset().top
	    }, 700);

		for (let i = 0; i < cardPoints.length; i++) {
			let card = document.createElement('div');
			let h3 = document.createElement('h3');

			h3.textContent = cardPoints[i];
			card.appendChild(h3);
			card.classList.add('card');
			card.classList.add('d-none');
			card.id = i;
			if (i === 0 || i == cardPoints.length - 1) {
				card.classList.add('first-or-last');
				card.addEventListener('click', addToHand);
			}

			playground.appendChild(card);
			fade(card.id);
		}

		for (let i = 0; i < k; i++) {
			let card = document.createElement('div');
			let h3 = document.createElement('h3');

			h3.textContent = '?';
			card.appendChild(h3);
			card.classList.add('card');
			card.classList.add('blank-card');

			hand.appendChild(card);
		}
	}

	function addToHand() {
		let handCards = qsa('.hand > .card');
		let handCard = handCards[handIndex];
		handCard.children[0].textContent = this.children[0].textContent;
		handCard.classList.add('first-or-last');
		handCard.classList.remove('blank-card');
		handCard.addEventListener('click', removeFromHand);
		handCard.id = this.id;
		if (handIndex - 1 >= 0) {
			let prev = handCards[handIndex - 1];
			prev.classList.remove('first-or-last');
			prev.removeEventListener('click', removeFromHand);
		}
		handIndex++;

		this.classList.add('taken');
		this.classList.remove('first-or-last');
		this.removeEventListener('click', addToHand);

		let cardPointsDiv = qs('.cardPoints').children;
		let id = parseInt(this.id);
		let next;

		let li = document.createElement("li");
		li.textContent = "cardPoints[" + id + "] = " + cardPoints[id] + " added to the hand.";
		qs("#logs").appendChild(li);
		qs("#actions-taken").textContent = parseInt(qs("#actions-taken").textContent) + 1;


		if (id === right) {
			next = cardPointsDiv[id - 1];
			right--;
		} else {
			next = cardPointsDiv[id + 1];
			left++;
		}


		next.classList.add('first-or-last');
		next.addEventListener('click', addToHand);

		if (handIndex == handCards.length) {
			cardPointsDiv[left].removeEventListener('click', addToHand);
			cardPointsDiv[right].removeEventListener('click', addToHand);
			cardPointsDiv[left].classList.remove('first-or-last');
			cardPointsDiv[right].classList.remove('first-or-last');
		}

		points += parseInt(this.children[0].textContent);
		qs('#current-point').textContent = points;
		if (handIndex == cardPoints.length) {
			qs('#maximum-point').textContent = Math.max(points, parseInt(qs('#maximum-point').textContent));
		}
	}

	function removeFromHand() {
		let handCards = qsa('.hand > .card');
		this.children[0].textContent = "?";
		this.classList.remove('first-or-last');
		this.removeEventListener('click', removeFromHand);
		this.classList.add('blank-card');
		if (handIndex > 1) {
			let prev = handCards[handIndex - 2];
			prev.addEventListener('click', removeFromHand);
			prev.classList.add('first-or-last');
		}
		handIndex--;

		let cardPointsDiv = qs('.cardPoints').children;
		let id = parseInt(this.id);
		let current = cardPointsDiv[id];
		let prev;
		if (id == right + 1) {
			prev = cardPointsDiv[id - 1];
			right++;
		} else {
			prev = cardPointsDiv[id + 1];
			left--;
		}

		let li = document.createElement("li");
		li.textContent = "cardPoints[" + id + "] = " + cardPoints[id] + " removed from the hand.";
		qs("#logs").appendChild(li);
		qs("#actions-taken").textContent = parseInt(qs("#actions-taken").textContent) + 1;


		if (id != 0 || id != cardPoints.length - 1) {
			if (right != left + 1) { 
				prev.classList.remove('first-or-last');
				prev.removeEventListener('click', addToHand);
			}
			current.classList.remove('taken');
			current.classList.add('first-or-last');
			current.addEventListener('click', addToHand);
		}

		if (handIndex == handCards.length - 1) {
			cardPointsDiv[left].addEventListener('click', addToHand);
			cardPointsDiv[right].addEventListener('click', addToHand);
			cardPointsDiv[left].classList.add('first-or-last');
			cardPointsDiv[right].classList.add('first-or-last');
		}
		
		points -= parseInt(current.children[0].textContent);
		qs('#current-point').textContent = points;
	}

	let speed = 500;
	async function bruteforce() {
		$('#reset').trigger('click');
		let li = document.createElement("li");
		li.textContent = "Bruteforce solution initiated...";
		qs("#logs").appendChild(li);
		li = document.createElement("li");
		li.textContent = "Bruteforce solution complete, max score is: " + await bruteforce_helper(k, 0, cardPoints.length - 1) + ".";
		qs("#logs").appendChild(li);
	}

	function bruteforce_helper(i, l, r) {
		return new Promise(async (resolve, reject) => {
			if (i === 0) {
				setTimeout(() => {resolve(0)}, speed);
				
			} else {
				setTimeout(async() => {
					$('.cardPoints > .first-or-last').eq(0).trigger('click');
					let L = cardPoints[l] + await bruteforce_helper(i - 1, l + 1, r);
					await removeLast();
					$('.cardPoints > .first-or-last').eq(1).trigger('click');
					let R = cardPoints[r] + await bruteforce_helper(i - 1, l, r - 1);
					await removeLast();
					resolve(Math.max(L, R));
				}, speed);
			}
		});
	}

	function removeLast() {
		return new Promise((resolve, reject) => {
			$('.hand > .first-or-last').eq(0).trigger('click');
			setTimeout(resolve, speed);
		});
	}

	
	function fade(id) {
		$('#'+id).fadeIn(700).removeClass('d-none').addClass('d-flex');
	}


	function qs(selector) {
		return document.querySelector(selector);
	}

	function qsa(selector) {
		return document.querySelectorAll(selector);
	}
})();