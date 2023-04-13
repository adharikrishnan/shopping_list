
// Working Elements
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clrBtn = document.getElementById('clear');
const filterBar = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let editModeOn = false;

function addItem(e){

    e.preventDefault();
    
    if(itemInput.value === ''){
        showAlert('Please enter an Item', 'error')
    }
    else if(checkItem(itemInput.value)){
        showAlert(`'${itemInput.value}' is an item already in the List`, 'remove');
    }
    else {
        enterItem(itemInput.value);
        LocalStorage.addToStorage(itemInput.value);
        
        if(editModeOn){
            console.log('Edit mode on')
            const editItem = itemList.querySelector('.edit-mode');
            LocalStorage.removeItem(editItem.textContent.trim());

            editItem.classList.remove('edit-mode');
            editItem.remove();
            editModeOn = false;
            editUI();
        }

        showAlert('Item Added Successfully', 'success');
        itemInput.value = '';       
    }
    updateUI()
}

function showAlert(msg, type){
    const div = document.createElement('div');
    div.className = `alert ${type}`;
    div.appendChild(document.createTextNode(msg));

    itemForm.insertBefore(div, document.querySelector('.form-control'));

    setTimeout(() => document.querySelector('.alert').remove(), 3000);
}

function checkItem(item){
    const items = Array.from(itemList.children).map((item) => item.textContent.trim().toLowerCase());
    return items.includes(item.trim().toLowerCase());      
}


function enterItem(item){

    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = document.createElement('button');
    button.className = 'remove-item btn-link text-red';

    const icon = document.createElement('i')
    icon.className = 'fa-solid fa-xmark'

    button.appendChild(icon);
    li.appendChild(button);

    itemList.appendChild(li);
}

function onClick(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        const item = e.target.parentElement.parentElement
        item.remove();
        LocalStorage.removeItem(item.firstChild.textContent.trim())
    } else {
        editItem(e.target);   
    }
    updateUI()
}

function editItem(item){

    if(!editModeOn){
        editModeOn = true;
        itemList.querySelectorAll('li').forEach((item => item.classList.remove('edit-mode')))  
        item.classList.add('edit-mode');
        editUI(item.textContent);
    } else if(editModeOn && item.classList.contains('edit-mode')) {
        editModeOn = false;
        item.classList.remove('edit-mode')
        editUI();
    } else {
        itemList.querySelectorAll('li').forEach((item => item.classList.remove('edit-mode')))  
        item.classList.add('edit-mode');
        editUI(item.textContent);
    }  
}

function editUI(item = null){
    if(item !== null){
        itemInput.value = item;
        formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
        formBtn.style.backgroundColor = '#00e622'
    } else {
        itemInput.value = '';
        formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
        formBtn.style.backgroundColor = '#333';
    }
}



function clearList(){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    }
    localStorage.clear();
    updateUI()  
}

function updateUI(){
    const itemList = document.getElementById('item-list');

    if(!itemList.hasChildNodes()){
        console.log("Item List has no Nodes!");
        clrBtn.style.display = 'none';
        filterBar.style.display = 'none';
    } else {
        clrBtn.style.display = 'block';
        filterBar.style.display = 'block';
    }

}

function filterList(e){

    const items = document.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const node = item.firstChild.textContent.toLowerCase();
        if(node.indexOf(text) != -1){
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';     
        }
        console.log(item.style.display);     
    })
}


function LocalStorage(){};

LocalStorage.getItemsFromStorage = () => {

    let items;
    localStorage.getItem('items') === null ? items = [] : items = JSON.parse(localStorage.getItem('items'));
    return items;
}

LocalStorage.addToStorage = (item) => {
    
    let items = LocalStorage.getItemsFromStorage();
    
    items.push(item);
        
    localStorage.setItem('items', JSON.stringify(items));

    
}

LocalStorage.displayFromLocalStorage = () =>{
    const items = LocalStorage.getItemsFromStorage();

    items.forEach((item) => {
        enterItem(item);
    })
    updateUI()
}

LocalStorage.removeItem = (item) => {
      
    let items = LocalStorage.getItemsFromStorage();

    items.forEach((sItem,index) => {
        if(sItem.toLowerCase() === item.toLowerCase()){
            items.splice(index, 1);
        }
    })  
    localStorage.setItem('items', JSON.stringify(items));

}

// Event Listeners
itemForm.addEventListener('submit', addItem);
itemList.addEventListener('click', onClick)
clrBtn.addEventListener('click',  clearList);
filterBar.addEventListener('input', filterList);
document.addEventListener('DOMContentLoaded', LocalStorage.displayFromLocalStorage)
updateUI();