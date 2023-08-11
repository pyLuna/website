var myTable = document.getElementById("productTable");
let newArr= new Set();
let drp = document.getElementById("drpmenu");
$(document).ready(function(){
    TableAppend();
});

function TableAppend(){
	fetch('https://localhost:7105/api/product/all')
		.then(res => {
			if (res.ok) {
				// API request was successful
				return res.json();
			}
            else{
                console.log(res.status);
            }
		})
			.then(items => {
				myTable.innerHTML = "";
                for(var i =0; i < items.length; i++){
					// Create a new row
					var newRow = myTable.insertRow();

					// Insert cells into the row
					var id = newRow.insertCell(0);
					var name = newRow.insertCell(1);
					var categ = newRow.insertCell(2);
					var desc = newRow.insertCell(3);
					var act = newRow.insertCell(4);

					id.innerHTML = items[i].product_id;
					name.innerHTML = items[i].product_name;
					categ.innerHTML = items[i].product_category;
					desc.innerHTML = items[i].product_description;
					act.innerHTML = `<a href="#" class="btn btn-danger btn-icon-split" onclick="DeleteItem(${items[i].product_id})">` +
					`<span class="icon text-white-50">` +
						`<i class="fas fa-trash"></i>` +
					`</span>`;

					myTable.appendChild(newRow);
					
                }
  				$('#dataTable').DataTable();
				newArr = Array.from(new Set(items.map(item => item.product_category)));
				for(let i = 0; i < newArr.length; i++){
					const linkElement = document.createElement('a');
					linkElement.classList.add("dropdown-item");
					linkElement.textContent = newArr[i];
					linkElement.addEventListener('click', function(event) {
						event.preventDefault();
						PopulateTable(newArr[i],items);
					});
					drp.appendChild(linkElement);
				}
				const linkElement = document.createElement('a');
				linkElement.classList.add("dropdown-item");
				linkElement.textContent = "Show All";
				linkElement.addEventListener('click', function(event) {
					event.preventDefault();
					PopulateTable("Show All",items);
				});
				drp.appendChild(linkElement);
			})
			.catch(error => {
				console.error(error);
			});
}

function PopulateTable(item,arr){
	myTable.innerHTML = "";
	for(var i =0; i < arr.length; i++){
		if(arr[i].product_category === item || item === "Show All"){
		var newRow = myTable.insertRow();

		var id = newRow.insertCell(0);
		var name = newRow.insertCell(1);
		var categ = newRow.insertCell(2);
		var desc = newRow.insertCell(3);
		var act = newRow.insertCell(4);

		id.innerHTML = arr[i].product_id;
		name.innerHTML = arr[i].product_name;
		categ.innerHTML = arr[i].product_category;
		desc.innerHTML = arr[i].product_description;
		act.innerHTML = `<a href="#" class="btn btn-danger btn-icon-split" onclick="DeleteItem(${arr[i].product_id})">` +
		`<span class="icon text-white-50">` +
			`<i class="fas fa-trash"></i>` +
		`</span>`;
		// Append the row to the table
		myTable.appendChild(newRow);
		}
		
	}
	  $('#dataTable').DataTable();
}

function DeleteItem(id){
	fetch(`https://localhost:7105/api/product/delete?id=${id}`,{
		method : 'POST'
	})
	.then(res => {
		if(res.ok){
			return res.json();
		}
	})
	.then(data =>{
		TableAppend();
		console.log(data.message);
	})
	.catch(error =>{
		console.error(error);
	});
}