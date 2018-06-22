'use strict';

class myLists
{

	constructor( options )
	{
		options = options || false;
		
		let lists =
		{
			'Default': '18988,325406,1933,2801,551035,596635,181108,2111,94867,1380,206,666676,2087,596243',
			'TAA': '325406,551035,2801,94867,2111,666676',
			'YOLO MOM': '1933,325406,551035,2087,1380,716096,94867,596635,2111,596243,596238,2801',
			'Index':
			'18988,155458,18997,18984,134948,434423,155324,155712'
		};
	
		// get from localStorage if exists
		if( localStorage.lists ){
			lists = JSON.parse(localStorage.lists);
		}
		// else use default
		else {
			localStorage.lists = JSON.stringify(lists); // set default at localStorage
		}
		
		//this.lists = lists;
		this.lists = lists;
		
		// init *** THIS IS STUPID ***
		this.addButtons();
		
	}
	
	
	/* addButtons */
	addButtons()
	{
		let list = document.getElementById('lists');
		let lists = this.lists;
		let html = '';
		let cssClass = '';
		
		for( let name in lists )
		{
			name == 'Default' ? cssClass = 'on' : cssClass = '';
			
			if( name == 'Alla' )
			{
				html += '<button class="list" data-list="'+ lists[name] +'">'+ name +'</button>';
			}
			else
			{
				let niceName = name.replace(/_/g, ' ');
				html += '<div class="btn-group">';
				html += '<button class="list '+cssClass+'" id="'+ name +'" data-list="'+ lists[name] +'" data-name="'+ name +'">'+ niceName +'</button>';
				html += '<button class="edit" data-rel="'+ name +'">Edit</button><button class="remove" data-rel="'+ name +'" title="Radera">&times;</button> ';
				html += '</div>';
			}
		}
		
		list.innerHTML = html;
		
		// bind
		$(list).on('click', '.list', function(e){
			e.preventDefault();
			let myList = $('#myList');
			myList[0].value = this.getAttribute('data-list');
			$('#list').trigger('submit');
		})
	}
	
	get_lists()
	{
		return this.lists;
	}
	
} // myLists {}