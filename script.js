$(document).ready(function(){
    getAllData();
    getUsers();
    $("#dynamicPagination li").click(function() {
        
        handler(parseInt($(id).text())) 
    });
    
   

    function getAllData(){
        $.ajax({
            url: 'https://5fd8e9d77e05f000170d32b3.mockapi.io/users',
            method: 'GET',
            dataType: 'json',

            success: function(data){
               createPagination(data.length);
               
            }
        })       
    }

    function createPagination(size){
        let pageNumber = Math.ceil(size / 10);
        console.log(pageNumber);
        for(let i=1; i<=pageNumber; i++){
            $('#dynamicPagination').append($("<li class='page-item'>")
            .append($("<a class='page-link'>").attr('id',i)  .append(i)))
        }
    }

    function getUsers(){
        //todo body
        $.ajax({
            url: 'https://5fd8e9d77e05f000170d32b3.mockapi.io/users?page=1&limit=10',
            method: 'GET',
            dataType: 'json',

            success: function(data){
                console.log(data);
                
                createHeader(getHeaderName(data));
                createBody(data);

            }
        }
        )    
    }

    function createHeader(headers){
       // $('#dynamicHeader').html('');
        $(headers).each(function(i,header){
            $('#dynamicHeader').append($("<th scope='col'>").append(header))
        })
    }

    function createBody(data){
        $(data).each(function(i, item){
            $('#dynamicBody').append($("<tr>")
                             .append($("<td>").append(item.id))
                             .append($("<td>").append(item.name))
                             .append($("<td>").append(item.surname))
                             .append($("<td>").append(item.phoneNumber)));
        });
    }

})




function getHeaderName(data){
    const initialObj = data[1];
    let headers = Object.keys(initialObj);
    return headers;
}

function calculateTableSize(size){
   
    return Math.ceil(size / 10);
}

function handler(number){
    console.log(number);
}

function deneme(){
    document.getElementById("1").addEventListener("onclick", handler("asasas"));
}

