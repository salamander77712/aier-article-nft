class Element{
	constructor(id, tag, style='', root='root'){
		this.id = id;
		this.style = style;
		this.root = root;
		this.tag = tag;
		this.displayed = false;
		this.disabled = false;
	}
	display(){
		if(!this.displayed){
			let elem = document.createElement(this.tag);
			elem.id = this.id;
			if(this.style != ''){
				elem.style = this.style;
			}
			elem = this.setAttributes(elem);
			try{
			document.getElementById(this.root).appendChild(elem);
			}
			catch{
				console.log(this.root);
			}
			this.displayed = true;
		}
	}
	die(){
		if(this.displayed){
			try{
			document.getElementById(this.id).remove();
			}
			catch{
			}
			this.displayed = false;
		}
	}
	disable(){
		if(!this.disabled && this.displayed){
			document.getElementById(this.id).disabled = true;
			this.disabled = true;
		}
	}
	enable(){
		if(this.disabled && this.displayed){
			document.getElementById(this.id).disabled = false;
			this.disabled = false;
		}
	}
	setAttributes(elem){
		elem.disabled = this.disabled;
		return elem;
	}
}
class ElementGroup{
	constructor(id, root='root', style='', parent='div'){
		this.id = id;
		this.elements = [];
		this.root = root;
		this.style = style;
		this.displayed = false;
		this.disabled = false;
		this.isSetup = false;
		this.parent = parent;
	}
	display = () =>{
		if(!this.displayed){
			let d = document.createElement(this.parent);
			d.id = this.id;
			if(this.style != ''){
				d.style = this.style;
			}
			d = this.setAttributes(d);
			document.getElementById(this.root).appendChild(d);
			if(!this.isSetup){
				this.setup();
				this.isSetup = true;
			}
			for(let i = 0; i < this.elements.length; i++){
				this.elements[i].display();
			}
			this.displayed = true;
			this.update();
		}
	}
	setup(){
		return;
	}
	update(){
		return;
	}
	setAttributes(elem){
		return elem;
	}
	die(){
		if(this.displayed){
			for(let i = 0; i < this.elements.length; i++){
				try{
					this.elements[i].die();
				}
				catch{
				}
			}
			try{
				document.getElementById(this.id).remove();
			}
			catch{
			}
			this.displayed = false;
		}
	}
	disable(){
		if(!this.disabled){
			for(let i = 0; i < this.elements.length; i++){
				this.elements[i].disable();
			}
			this.disabled = true;
		}
	}
	enable(){
		if(this.disabled){
			for(let i = 0; i < this.elements.length; i++){
				this.elements[i].enable();
			}
			this.disabled = false;
		}
	}
	addElement(element){
		this.elements.push(element);
	}
	disableAll(){
		if(!this.disabled){
			Useful.disableChildren(this.id);
			this.disabled = true;
		}
	}
	enableAll(){
		if(this.disabled){
			Useful.disableChildren(this.id, false);
			this.disabled = false;
		}
	}
}
class Select extends Element{
	constructor(id, multiple=false, style='width : 1000px', changeFunction=function(){return;},root='root', values=[], displays=[]){
		super(id, 'select', style, root)
		this.multiple = multiple;
		this.changeFunction = changeFunction;
		this.values = values;
		this.displays = displays;
	}
	display(){
		super.display();
		this.loadOptions();
	}
	setAttributes(elem){
		elem.multiple = this.multiple;
		elem.onchange = this.changeFunction;
		elem.disabled = this.disabled;
		return elem;
	}
	resetOptions(){
		Useful.killChildren(this.id);
	}
	loadOptions(){
		for(let i = 0; i < this.values.length; i++){
			let newOption = document.createElement("option");
			newOption.value = this.values[i];
			newOption.innerHTML = this.displays[i];
			document.getElementById(this.id).appendChild(newOption);
		}
	}
	changeValues(newValues){
		this.values = newValues;
	}
	changeDisplays(newDisplays){
		this.displays = newDisplays;
	}
	getValue(){
		let options = document.getElementById(this.id) && document.getElementById(this.id).options;
		let selected_values = [];
		for(let i = 0; i < options.length; i++){
			if(options[i].selected){
				selected_values.push(options[i].value);
			}
		}
		return selected_values;
	}
}
class Paragraph extends Element{
	constructor(id, style = '', root='root'){
		super(id, 'p', style, root);
	}
	changeText(newText){
		document.getElementById(this.id).innerHTML = newText;
	}
	disable(){
		if(!this.disabled && this.displayed){
			document.getElementById(this.id).style = this.style + '; color : gray'
			this.disabled = true;
		}
	}
	enable(){
		if(this.disabled && this.displayed){
			document.getElementById(this.id).style = this.style
			this.disabled = false;
		}
	}
}
class Button extends Element{
	constructor(id, func, text, style='', root = 'root'){
		super(id, 'button', style, root);
		this.func = func;
		this.text = text;
	}
	setAttributes(elem){
		elem.onclick=this.func;
		elem.innerHTML = this.text;
		return elem;
	}
	changeText(newText){
		this.text = newText;
		if(this.displayed){
			document.getElementById(this.id).innerHTML = this.text;
		}
	}
	changeFunction(newFunction){
		this.func = newFunction;
		if(this.displayed){
			document.getElementById(this.id).onclick = this.func;
		}
	}
}
class Label extends Element{
	constructor(id, text, style='', root = 'root'){
		super(id, 'label', style, root);
		this.text = text;
	}
	setAttributes(elem){
		elem.innerHTML = this.text;
		return elem;
	}
	changeText(newText){
		this.text = newText;
		this.innerHTML = this.text;
	}
	disable(){
		if(!this.disabled && this.displayed){
			document.getElementById(this.id).style = this.style + '; color : gray'
			this.disabled = true;
		}
	}
	enable(){
		if(this.disabled && this.displayed){
			document.getElementById(this.id).style = this.style
			this.disabled = false;
		}
	}
}
class TextField extends Element{
	constructor(id, style='', root = 'root'){
		super(id, 'input', style, root);
	}
	setAttributes(elem){
		elem.type = 'text';
		return elem;
	}
	getValue = () =>{
		let value = document.getElementById(this.id).value;
		if(value == ''){
			return undefined;
		}
		else{
			return value;
		}
	}
}
class BR extends Element{
	constructor(id, style='', root = 'root'){
		super(id, 'br', style, root);
	}
}
class DIV extends Element{
	constructor(id, style='', root='root'){
		super(id, 'div', style, root);
	}
}
class LabeledTextField extends ElementGroup{
	constructor(id, text, root){
		super(id, root);
		this.text = text;
	}
	setup = () =>{
		this.addElement(new Label(this.id + '-label', this.text, '', this.id));
		this.addElement(new BR(this.id + '-br-1', '', this.id));
		this.addElement(new TextField(this.id + '-textfield', '', this.id));
	}
	getValue = () =>{
		return this.elements[2].getValue();
	}
}
class Link extends Element{
	constructor(id, link, text, style='', root='root', target='_blank'){
		super(id, 'a', style, root);
		this.link = link;
		this.text = text;
		this.target = target;
	}
	setAttributes(elem){
        elem.href = this.link;
        elem.innerHTML = this.text;
        elem.target = this.target;
        return elem;
    }
	changeText = (text) =>{
		this.text = text;
		if(this.displayed){
			document.getElementById(this.id).innerHTML = this.text;
		}
	}
	changeLink = (link) =>{
		this.link = link;
		if(this.displayed){
			document.getElementById(this.id).href = this.link;
		}
	}

}