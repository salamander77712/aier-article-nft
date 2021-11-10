class Useful{
	static async get(url){
	  const response = await fetch(url);
	  const json = await response.json();
	  return await json;
	}
	static range(start, end){
	  let output = [];
	  for(let i = start; i < end; i++){
		output.push(i);
	  }
	  return output;
	}
	static rangeFromArray(array){
	  return Useful.range(0, array.length);
	}
	  static killChildren(id, killSelf=false){
	  parent = document.getElementById(id);
	  while (parent.firstChild){
		parent.removeChild(parent.firstChild);
	  }
	  if(killSelf){
		parent.remove();
	  }
	}
	static disableChildren(id, disable=true){
	  let children = document.getElementById(id).children;
	  for(let i = 0; i < children.length; i++){
		try{
		  children[i].disabled = disable;
		}
		catch{
		}
		if(children[i].children.length > 0){
		  try{
		  Useful.disableChildren(children[i].id, disable);
		  }
		  catch{
		  }
		}
	  }
	}
	static stupidBool(bool){
	  if(bool == true || bool == 'true'){
		return true;
	  }
	  else{
		return false;
	  }
	}
  }