console.log("Hellow world!");


const DOMAIN = "https://utn-avanzada2-primerparcial.herokuapp.com";
const ENDPOINT_STUDENT = DOMAIN + "/api/student";
const ENDPOINT_CAREER = DOMAIN + "/api/career";
const tbody = document.getElementById("myTbody");

function RetrieveData() {
    return Promise.all([getStudents(), getCareers()]);
}

function getStudents() {
    return makeRequest("GET", ENDPOINT_STUDENT);
}

function getCareers() {

    return makeRequest("GET", ENDPOINT_CAREER);
}

function makeRequest(method, url) {
    return new Promise((resolve, reject) => {

        const request = prepareRequest(method, url);
        request.onload = function () {
            if (request.status >= 200 && request.status < 300) {
                if (request.response) {
                    resolve(JSON.parse(request.response));
                } else {
                    resolve("Ok");
                }

            } else {
                reject("Request status invalid!")
            }
        };

        request.onerror = () => reject("Couldn't make request!");

        request.send();

    });
}


function prepareRequest(method, url) {
    let request = new XMLHttpRequest();
    request.open(method, url);
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("Access-Control-Allow-Credentials",  "*")
    return request;
}

async function RefreshTable() {


    tbody.innerHTML = "";

    let students = [...await getStudents()];
    let careers = [...await getCareers()];

    students = students.filter(student => student.careerId !== null);
    students = students.sort((a, b) => { return (a.lastName < b.lastName) ? 1 : -1; });
    careers = careers.filter(career => career.active === true);






    students.forEach(student => {


        careers.forEach(career => {


            if (career.careerId == student.careerId) {

                student.name = career.name;
                

                let tr = createLine(student);


                tbody.appendChild(tr);
            }
        });
    });







}

let thead = ["studentId", "name", "firstName", "lastName", "email"]

function createLine(student) {

    

  


    let tr = document.createElement("tr");
    let button = createButton(student.studentId);
    
    thead.forEach( element => {
        let td = document.createElement("td");
        td.innerHTML = student[element];
        tr.appendChild(td);
    });


    tr.appendChild(button);

    tr.classList.add("class")

    return tr;

}

function createButton(id){
    let botton = document.querySelector("button");
    let newButton = document.createElement("button");
    newButton.innerText = "Delete";
    let classes = ["btn", "btn-danger", "btn-sm"];
    classes.forEach(element => newButton.classList.add(element));
    newButton.value =id;
    newButton.addEventListener("click", deleteStudent);
    return newButton;
}
RefreshTable();


function deleteStudent(event) {
    let button = event.srcElement;
    let id = button.value;

    makeRequest("DELETE", DOMAIN + "/api/student/" + id)
        .then(() => { RefreshTable() })
        .catch(error => console.log(error));

}


function deleteRow(id) {
    makeRequest("DELETE", DOMAIN + "/api/student/" + id)
        .then(() => { RefreshTable() })
        .catch(error => console.log(error));
}




