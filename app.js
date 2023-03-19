let onCharsetChange;
let n;

function app(){
	const container = document.createElement("div");

	const a = document.createElement("section");
	a.classList.add("a");
	if(window.localStorage.getItem("a") == null){
		window.localStorage.setItem("a", "navajoWhite");
		window.localStorage.setItem("b", "tan");
		background(a, "navajoWhite", "tan");
	}
	else{
		background(a, window.localStorage.getItem("a"), window.localStorage.getItem("b"));
	}
	
	const queBox = document.createElement("div");
	queBox.classList.add("queBox");
	queBox.innerText="?";

	const errorBox = document.createElement("div");
	errorBox.classList.add("errorBox");

	const optionsGrid = document.createElement("div");
	optionsGrid.classList.add("optionsGrid");

	const answerBox = document.createElement("input");
	answerBox.classList.add("answerBox");
	answerBox.autofocus = true;

	const enterButton = document.createElement("button");
	enterButton.classList.add("enterButton");
	enterButton.innerText = "ok";
	enterButton.addEventListener("click", () => check(answerBox.value));

	const showButton = document.createElement("button");
	showButton.classList.add("showButton");
	showButton.innerText = "reveal"

	const skipButton = document.createElement("button");
	skipButton.classList.add("skipButton");
	skipButton.innerText = "skip"

	a.appendChild(showButton);
	a.appendChild(skipButton);
	a.appendChild(queBox);
	a.appendChild(errorBox);
	a.appendChild(optionsGrid);
	a.appendChild(answerBox);
	a.appendChild(enterButton);

	const cosmeticMenu = document.createElement("section");
	cosmeticMenu.classList.add("cosmetic");
	cosmeticMenu.classList.add("menu");

	const fontRadio = document.createElement("fieldset");

	const serif = "serif, 'Noto Serif Georgian', 'ＭＳ 明朝', 'MS Mincho', 'Hiragino Mincho Pro', 'ヒラギノ明朝 Pro W3', '游明朝', 'YuMincho', 'ＭＳ Ｐ明朝', 'MS PMincho', 'Hiragino Mincho ProN', 'Noto Serif JP'"
	queBox.style.fontFamily = serif;
	fontRadio.innerHTML = `
		<legend>glyph font</legend>
		<label><input name="font" type="radio" checked value="${serif}"/>serif</label>
		<label><input name="font" type="radio" value="sans-serif"/>sans serif</label>
		<label><input name="font" type="radio" value="custom"/><input type="text" id="customFont" placeholder="custom font" /></label>
		${hand?`<label><input name="font" type="radio" value="${hand}"/>handwriting</label>`:``}
	`;

	fontRadio.querySelector('#customFont').addEventListener("click", () => {
		fontRadio.querySelector('input[value="custom"]').checked = true;
	});

	fontRadio.querySelector('#customFont').value = window.localStorage.getItem("customFont");

	fontRadio.addEventListener("click", () => {
		updateFont();
	});

	fontRadio.addEventListener("keyup", () => {
		updateFont();
	});

	function updateFont(){
		const value = fontRadio.querySelector('input:checked').value;
		if (value == "custom"){
			const custom = fontRadio.querySelector('#customFont').value;
			queBox.style.fontFamily = custom + ", '" + custom + "'";
			window.localStorage.setItem("customFont", custom);
		}else{
			queBox.style.fontFamily = value;
		}
	}

	cosmeticMenu.appendChild(fontRadio);

	const entryRadio = document.createElement("fieldset");

	entryRadio.innerHTML = `
		<legend>entry method</legend>
		<label><input name="entry" type="radio" value="grid" ${defaultEntry == "grid" ? "checked" : ""}/>options grid</label>
		<label><input name="entry" type="radio" value="grid2" ${defaultEntry == "grid2" ? "checked" : ""}/>reversed options grid</label>
		<label><input name="entry" type="radio" value="text" ${defaultEntry == "text" ? "checked" : ""}/>typing</label>
		<label><input name="entry" type="radio" value="automatic" ${defaultEntry == "automatic" ? "checked" : ""}/>typing (automatic entry)</label>
	`;

	entryRadio.addEventListener("click", () => {
		updateEntry(entryRadio.querySelector("input:checked").value);
	});

	entryRadio.addEventListener("keyup", () => {
		updateEntry(entryRadio.querySelector("input:checked").value);
	});

	function updateEntry(value){
		entry = value ? value : defaultEntry;

		if(entry == "grid" || entry == "grid2"){
			answerBox.style.display = "none";
			enterButton.style.display = "none";
			optionsGrid.style.display = "block";
		}else{
			answerBox.style.display = "inline";
			enterButton.style.display = "inline";
			optionsGrid.style.display = "none";
		}

		const ob = offs;

		if(entry == "grid2"){
			offs = -Math.abs(offs);
		}else{
			offs = Math.abs(offs);
		}

		if(ob != offs){
			next();
		}
	}

	cosmeticMenu.appendChild(entryRadio);

	const lineMenu = document.createElement("fieldset");
	lineMenu.innerHTML = "<legend>guidlines</legend>";

	let underline = false;
	let overline = false;

	lineMenu.appendChild(makeCheckbox(() => {queBox.style.textDecoration = `${underline?`underline`:``} overline solid ${window.localStorage.getItem("a")} 2px`; overline = true},
									  () => {queBox.style.textDecoration = underline?`underline solid ${window.localStorage.getItem("a")} 2px`:``; overline = false},
									  "overline"));

	lineMenu.appendChild(makeCheckbox(() => {queBox.style.textDecoration = `underline ${overline?`overline`:``} solid ${window.localStorage.getItem("a")} 2px`; underline = true},
									  () => {queBox.style.textDecoration = overline?`overline solid ${window.localStorage.getItem("a")} 2px`:``; underline = false},
									  "baseline"));

	cosmeticMenu.appendChild(lineMenu);

	const colorOpts = document.createElement("fieldset");
	colorOpts.innerHTML = "<legend>theme</legend>";
	
	const colors = [
		["tan", "navajoWhite"],
		["paleVioletRed", "pink"],
		["seaGreen", "darkSeaGreen"],
		["dodgerBlue", "deepSkyBlue"],
		["blueViolet", "violet"],
		["coral", "orange"],
		["darkgrey", "lightgrey"],
		["maroon", "red"],
	];

	for(const color of colors){
		const button = document.createElement("button");
		button.classList.add("clr");
		button.style.background = color[0];
		button.addEventListener("click", () => {
			window.localStorage.setItem("a", color[0]);
			window.localStorage.setItem("b", color[1]);
			background(a, color[0], color[1]);
			queBox.style.textDecorationColor = color[0];
		});

		colorOpts.appendChild(button);
	}

	cosmeticMenu.appendChild(colorOpts);

	const mainMenu = document.createElement("section");
	mainMenu.classList.add("main");
	mainMenu.classList.add("menu");

	if(names){
		const inputRadio = document.createElement("fieldset");
		inputRadio.innerHTML = `
			<legend>type</legend>
			<label><input name="inputType" type="radio" value="1" checked/>${standardInputTypeName}</label>
			<label><input name="inputType" type="radio" value="2"/>letter names</label>
		`;

		inputRadio.addEventListener("click", () => {
			offs = Number(inputRadio.querySelector('input:checked').value);
			next();
		});

		inputRadio.addEventListener("keyup", () => {
			offs = Number(inputRadio.querySelector('input:checked').value);
			next();
		});

		mainMenu.appendChild(inputRadio);
	}

	let setLetterCase = (elem) => {
		elem.style.textTransform = "lowercase";
	}

	if(letterCase){
		const caseRadio = document.createElement("fieldset");
		caseRadio.innerHTML = `
			<legend>case</legend>
			<label><input name="case" type="radio" value="low" checked/>minuscule</label>
			<label><input name="case" type="radio" value="up" />majuscule</label>
			<label><input name="case" type="radio" value="both" />both</label>
		`;

		caseRadio.addEventListener("click", () => {
			updateLetterCase();
		});

		caseRadio.addEventListener("keyup", () => {
			updateLetterCase();
		});

		function updateLetterCase(){
			const caseType = caseRadio.querySelector('input:checked').value;
			if(caseType == "low"){
				setLetterCase = (elem) => {
					elem.style.textTransform = "lowercase";
				}
				if (entry != "grid2") setLetterCase(queBox);
			}
			else if(caseType == "up"){
				setLetterCase = (elem) => {
					elem.style.textTransform = "uppercase";
				}
				if (entry != "grid2") setLetterCase(queBox);				
			}
			else if(caseType == "both"){
				setLetterCase = (elem) => {
					elem.style.textTransform = Math.random() >  0.5 ? "uppercase" : "lowercase";
				}
			}
		}

		mainMenu.appendChild(caseRadio);
	}

	const languageMenu = makeLangMenu();
	mainMenu.appendChild(languageMenu);

	container.appendChild(a);
	container.appendChild(mainMenu);
	container.appendChild(cosmeticMenu);

	let target = "";
	let index = 0;

	n = names ? 3 : 2;
	let offs = 1;

	let entry;
	updateEntry();

	function next(){
		const i = Math.floor(Math.random()*charList.length/n)*n - (entry == "grid2" ? offs : 0);
		console.log(offs);

		if (index == i) return next();
		index = i;

		if (entry == "grid2"){
			queBox.style.textTransform = "capitalize"
		}
		else{
			setLetterCase(queBox);
		}

		target = charList[i+offs];
		queBox.innerHTML = charList[i] ? "&nbsp;" + charList[i] + "&nbsp;" : "";
		answerBox.value = "";
		answerBox.placeholder = answerPlaceholder;
		errorBox.innerText = "";

		let options;
		if(charList.length < 9 * n){
			options = charList.filter((v, i) => i%n == offs%n);
		}
		else{
			options = Array(Math.min(charList.length, 9)); 
			for(let i = 0; i < options.length; i++){
				let char;
				let safteyCounter = 0;
				let check = [];

				do {
					char = charList[Math.floor(Math.random()*charList.length/n)*n + (offs + Math.abs(offs))/2];
					safteyCounter++;
				} while (options.includes(char) && safteyCounter < 1000);

				options[i] = char;
			}

			if (!options.includes(charList[i + offs])) options[Math.floor(Math.random()*options.length)] = charList[i + offs];
		}

		optionsGrid.innerHTML = "";
		for(const option of options){
			const optionButton = document.createElement("button");
			if (entry == "grid2") setLetterCase(optionButton);

			if (option.length >= 5){
				optionButton.innerHTML = "<small>"+option+"</small>";
			}
			else{
				optionButton.innerHTML = option;
			}

			optionButton.addEventListener("click", () => {
				check(option);
				optionButton.style.background = "red";
				optionButton.style.borderColor = "#f55";
			});

			optionsGrid.appendChild(optionButton);
		}
	}

	onCharsetChange = next;

	function fail(wrong){
		let column = [];
		for(let i = offs; i < charList.length; i += n){
			column.push(charList[i]);
		}

		errorBox.innerHTML = `${wrong ? `You Answered <strong style="color: red;">"${wrong}"</strong> 
		${column.includes(wrong) ? `
			(<span style="font-family: ${fontRadio.querySelector('input:checked').value};">${charList[charList.indexOf(wrong)-offs]}</span>)`:``}
		` : ``} <br />
		The Correct Answer Was <strong style="color: green;">"${target}"</strong>`;

		answerBox.value = "";
		answerBox.placeholder = "Answer Again";
		queBox.style.border = "4px dashed red";
	}

	answerBox.addEventListener("input", () => {
		for(let i = 0; i < typingSubsts.length; i += 2){
			answerBox.value = answerBox.value.replace(typingSubsts[i], typingSubsts[i+1]);
		}

		if(entry == "automatic"){
			const value = answerBox.value.toLowerCase();

			if(value == target){
				setTimeout(()=>{
					if(answerBox.value.toLowerCase() == target){
						next();
						queBox.style.border = "4px solid lime";
					}
				}, 200);
			}
			else{
				let column = [];
				for(let i = offs; i < charList.length; i += n){
					column.push(charList[i]);
				}

				let startList = [];
				for(const char of column){
					if(value.length < char.length + (typingSubsts.length > 0)){
						const start = char.substring(0, value.length);
						if (value.length < char.length) startList.push(start);
						if (startList.includes(value)) break;

						if((value[0] == char[0] || value.length == 1) && typingSubsts.includes(start[start.length - 1])){
							for(let i = 0; i < typingSubsts.length; i += 2){
								console.log(typingSubsts[i + 1], start[start.length - 1])
								if(typingSubsts[i + 1] == start[start.length - 1]){
									console.log(11)
									startList.push(start.substring(0, start.length-1) + typingSubsts[i][0])
								}
							}
							if (startList.includes(value)) break;
						}
					}
				}
				console.log(column,startList)
				if(!startList.includes(value) && column.includes(value)){
					setTimeout(() => fail(value), 200);
				}
			}
		}
	});

	function check(value){
		if(value == target){
			next();
			queBox.style.border = "4px solid lime";
		}
		else{
			fail(value);
		}
	}

	answerBox.addEventListener("keydown", e => {
		if(e.key == "Enter"){
			check(answerBox.value.toLowerCase());
		}
	});

	showButton.addEventListener("click", () => {
		fail(false);
	});

	skipButton.addEventListener("click", () => {
		next();
		queBox.style.border = "4px solid grey";
	});

	a.addEventListener("click", () => {
		answerBox.focus();
	});

	return container;
}

function background(e, b, a){
	
	e.style.background=`
		linear-gradient(-45deg, ${b} 25%, transparent 25%, transparent 75%, ${a} 75%, ${a}) 0 0,
		linear-gradient(-45deg, ${a} 25%, transparent 25%, transparent 75%, ${b} 75%, ${b}) 0.25em 0.25em,
		linear-gradient(45deg, ${a} 17%, transparent 17%, transparent 25%, ${a} 25%, ${a} 36%, transparent 36%, transparent 64%, ${a} 64%, ${a} 75%, transparent 75%, transparent 83%, ${a} 83%) 0.25em 0.25em
	`;
	e.style.backgroundColor = `${b}`;
	e.style.backgroundSize = `0.5em 0.5em`;
}

function makeCheckbox(on, off, label){
	const labelElem = document.createElement("label");

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";	
	checkbox.addEventListener("input", () => {
		if(checkbox.checked){
			on();
		}
		else{
			off();
		}
	});
	labelElem.appendChild(checkbox);

	const labelText = document.createElement("span");
	labelText.innerHTML = label;

	labelElem.appendChild(labelText);

	return labelElem;
}

function makeLangMenu(){
	const menu = document.createElement("fieldset");
	menu.classList.add("langmenu");
	menu.innerHTML = "<legend>practice</legend>";

	if(charsets.length > 7){
		const all = document.createElement("button");
		all.innerHTML = "all";
		all.addEventListener("click", () => {
			for(const checkbox of menu.querySelectorAll("input.charset")){
				checkbox.checked = true;
			}
			update();
		});
		menu.appendChild(all);

		const none = document.createElement("button");
		none.innerHTML = "none";
		none.addEventListener("click", () => {
			for(const checkbox of menu.querySelectorAll("input.charset")){
				checkbox.checked = false;
			}
			update();
		});
		menu.appendChild(none);
	}

	for (let i = 0; i < charsets.length; i++){
		const charset = charsets[i];

		if(typeof charset == "string"){
			const text = document.createElement("div");
			text.innerHTML = charset;
			menu.appendChild(text);

			continue;
		}

		const checkbox = makeCheckbox(update, update, charset.name);
		checkbox.querySelector("input").classList.add("charset");

		checkbox.querySelector("input").setAttribute("id", "a" + i);

		if(charset.checked){
			checkbox.querySelector("input").checked = true;
		}

		menu.appendChild(checkbox);
	}

	

	return menu;
}

function update(){
	charList = [];
	for (const checkbox of document.body.querySelectorAll('input.charset:checked')){
		for (const char of charsets[checkbox.id.substring(1)].chars){
			charList.push(char);
		}

	}

	onCharsetChange();
}





