var selectedElementId=null;
var currentOp="";
var currentPage=1;
var totalPage= null;

$(document).ready(function () {
    getAllData();
    getElements();
})


//click-op
$(document).on("click", ".page-link", function () {
    if(this.id==="decreasePage"){
        if(currentPage>=2){
            currentPage--;
        }
    }
    else if (this.id==="increasePage") {
        if(currentPage<totalPage)
            currentPage++;
    }
    else{
        currentPage=this.id;
    }
    
    cleanBody()
    
    getElementByPageNumber(currentPage)

});

$(document).on("click", ".btn", function () {
    let strId = ""
    const idArr = this.id.match(/\d/g);
    for (index in idArr) { strId = strId + idArr[index] }

    if (this.id.includes("update")) {
        currentOp="update";
        updateRow(strId);
    }
    if (this.id.includes("delete")) {
        deleteRow(strId);
    }
    if(this.id.includes("search")){
        const key = $('#searchText').val();
        search(key);
        $('#searchText').val("");
    }
})

$(document).on("click", "#add", function () {
    currentOp="save";
    clearInputValue();
    showing(true);
});

$(document).on("click", "#saveBtn", function () {
    if(currentOp === "save")
        createElement();
    else
        updateElement(selectedElementId);
    clearInputValue();
    showing(false);
});


function search(key){
    $.ajax({
        url: 'https://5fd8e9d77e05f000170d32b3.mockapi.io/users?search='+key,
        method: 'GET',
        dataType: 'json',

        success: function (data) {
            cleanBody();
            cleanPagination();
            createBody(data);
        }
    })
}

function clearInputValue() {
    $('#formFirstName').val("");
    $('#formLastName').val("");
    $('#formPhoneNumber').val("");
}

function showing(show) {
    $('#tableArea').attr('hidden', show);
    $('#addingArea').attr('hidden', !show);
}

function cleanBody() {
    $('#dynamicBody').remove();
    $('.table').append($("<tbody id='dynamicBody'>"))

}

function getElementByPageNumber(number) {
    console.log(number);
    //todo body
    $.ajax({
        url: 'https://5fd8e9d77e05f000170d32b3.mockapi.io/users?page=' + number + '&limit=10',
        method: 'GET',
        dataType: 'json',

        success: function (data) {
            console.log(data);


            createBody(data);

        }
    })
}

function createElement() {
    let data = {
        name: $('#formFirstName').val(),
        surname: $('#formLastName').val(),
        phoneNumber: $('#formPhoneNumber').val(),
    }

    $.ajax({
        url: 'https://5fd8e9d77e05f000170d32b3.mockapi.io/users/',
        method: 'POST',
        dataType: 'json',
        data: data,
        success: function () {
            cleanBody();
            cleanPagination();
            getLastPage();
        }
    })
}


function createBody(data) {
    $(data).each(function (i, item) {
        $('#dynamicBody').append($("<tr>").attr('id', item.id)
            .append($("<td>").append(item.id))
            .append($("<td>").append(item.name))
            .append($("<td>").append(item.surname))
            .append($("<td>").append(item.phoneNumber))
            .append($("<td class='d-flex justify-content-center'>").append($("<button class='btn btn-primary mr-1'>").attr('id', "update" + item.id).append("Update"))
                .append($("<button class='btn btn-danger'>").attr('id', "delete" + item.id).append("Delete")))
        );
    });
}


function getHeaderName(data) {
    const initialObj = data[1];
    let headers = Object.keys(initialObj);
    return headers;
}

function calculateTableSize(size) {
    totalPage = Math.ceil(size / 10);
    return Math.ceil(size / 10);
}




function deleteRow(id) {
    $.ajax({
        url: 'https://5fd8e9d77e05f000170d32b3.mockapi.io/users/' + id,
        method: 'DELETE',
        dataType: 'json',

        success: function () {
            cleanBody();
            cleanPagination();
            getAllData();
            getElementByPageNumber(currentPage);

        }
    })
}

function updateRow(id) {
    getElementById(id);
    showing(true);

}

function getLastPage() {

    $.ajax({
        url: 'https://5fd8e9d77e05f000170d32b3.mockapi.io/users',
        method: 'GET',
        dataType: 'json',

        success: function (data) {
            createPagination(data.length);
            getElementByPageNumber(calculateTableSize(data.length))
        }
    })
}

function getAllData() {
    $.ajax({
        url: 'https://5fd8e9d77e05f000170d32b3.mockapi.io/users',
        method: 'GET',
        dataType: 'json',

        success: function (data) {
            createPagination(data.length);


        }
    })
}

function createPagination(size) {
    let pageNumber = Math.ceil(size / 10);
    totalPage = pageNumber;
    for (let i = 1; i <= pageNumber; i++) {
        $('#dynamicPagination').append($("<li class='page-item'>").attr('id','page'+ i)
            .append($("<a class='page-link'>").attr('id', i).append(i)))
    }
}

function cleanPagination() {
    for(i=1; i<=totalPage;i++){
        $('#page'+i).remove();
    }
    

}


function getElements() {
    //todo body
    $.ajax({
        url: 'https://5fd8e9d77e05f000170d32b3.mockapi.io/users?page=1&limit=10',
        method: 'GET',
        dataType: 'json',

        success: function (data) {
            console.log(data);

            createHeader(getHeaderName(data));
            createBody(data);

        }
    })
}

function createHeader(headers) {
    // $('#dynamicHeader').html('');
    $(headers).each(function (i, header) {
        $('#dynamicHeader').append($("<th scope='col'>").append(header))
    })
    $('#dynamicHeader').append($("<th class='d-flex justify-content-center' scope='col'>").append("işlemler"))
}

function getElementById(id) {
    $.ajax({
        url: 'https://5fd8e9d77e05f000170d32b3.mockapi.io/users/' + id,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            setInputValue(data);
        }
    })

}
function setInputValue(data){
    selectedElementId=data.id;
    $('#formFirstName').val(data.name);
    $('#formLastName').val(data.surname);
    $('#formPhoneNumber').val(data.phoneNumber);
}

function updateElement(id){
    console.log(id);
    let data = {
        name: $('#formFirstName').val(),
        surname: $('#formLastName').val(),
        phoneNumber: $('#formPhoneNumber').val(),
    }
    $.ajax({
        url: 'https://5fd8e9d77e05f000170d32b3.mockapi.io/users/' + id,
        method: 'PUT',
        dataType: 'json',
        data:data,
        success: function () {
            cleanBody();
            getElementByPageNumber(currentPage);
        }
    })
}
