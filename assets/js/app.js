var cl=console.log;
const Base_url="https://xhrcrud-default-rtdb.firebaseio.com"
const Mytodo_url=`${Base_url}/Mytodo.json`

const todoName=document.getElementById("todoName");
const isCompleted=document.getElementById("isCompleted");
const addTodoBtn=document.getElementById("addTodoBtn");
const updateTodoBtn=document.getElementById("updateTodoBtn");
const todoContainer=document.getElementById("todoContainer");
const Form=document.getElementById("Form");
const spinner=document.getElementById("spinner");


// localstorage
let state={
    MyTodoArr:[],
    Edit_Id:null,
}

// forin
function Forin(obj) {
    for (const key in obj) {
        obj[key].id = key;
        state.MyTodoArr.unshift(obj[key]);
    }
}

// / Snakbar
function Snakbar(msg,icon){
    Swal.fire({
        title:msg,
        icon:icon,
        timer:2500,
    
    })
}

// spinner
function Handlespinner() {
    spinner.classList.toggle("d-none")
    
}


// obj to arr
// function objToArr(obj) {
//   let arr = Object.entries(obj);
//   let MyTodoArr = arr.map((todo) => {
//     todo[1].id = todo[0];
//     state.MyTodoArr.push(todo[1]);
//     cl(state.MyTodoArr);
//   });
// }




    

// Templating
function Templating(arr){
    let result=``;
    arr.forEach(elem => {
        result+=`<li class="list-group-item d-flex justify-content-between"id="${elem.id}">
                              <div>
                                    <input onclick="checkbox(this)" type="checkbox" ${elem.isCompleted ? "checked" : ""}>
                                    <strong>${elem.todoItem}</strong>
                                </div>
                                <div>
                                    <i  onclick="EditLI(this)"class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                                    <i  onclick="RemoveLi(this)"class="fa-solid fa-trash-can fa-2x text-danger"></i>
                                </div>  
                            </li> `
        
    });
    todoContainer.innerHTML=result;
}

// create
async function Oncreate(eve){
    eve.preventDefault();
    try{
            Handlespinner();

        let newobj={
        todoItem: todoName.value.trim(),
        isCompleted:isCompleted.value === "yes" ? true : false,

  
    }

    let res= await fetch(Mytodo_url,{
        method:"POST",
        body:JSON.stringify(newobj),
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
        

        }
    });
    let data =await res.json();
    newobj.id=data.name;
    state.MyTodoArr.unshift(newobj)
    let li=document.createElement("li")
    li.id=newobj.id;
    li.className="list-group-item d-flex justify-content-between"
    li.innerHTML=  `<div>
                                    <input onclick="checkbox(this)" type="checkbox" ${newobj.isCompleted ? "checked" : ""}>
                                    <strong>${newobj.todoItem}</strong>
                                </div>
                                <div>
                                    <i  onclick="EditLI(this)"class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                                    <i  onclick="RemoveLi(this)"class="fa-solid fa-trash-can fa-2x text-danger"></i>
                                </div>`
                                todoContainer.append(li);
                                Snakbar("Todo Created","success")
                                Form.reset();

    }catch (err){
        cl(err)

    }finally{
        Handlespinner();
    }
}



// Read
async function OnShow(){
    Handlespinner();
    try{
       let res= await fetch(Mytodo_url,{
            method:"GET",
            body:null,
            headers:{
                "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
        
            }
        });
        let data =await res.json();
        cl(data)
        Forin(data)
        Templating(state.MyTodoArr);

    }catch (err) {
        cl(err)

    }finally{
        Handlespinner();
    }
}
OnShow()


// Edit
function EditLI(ele){
    let Edit_id=ele.closest("li").id;
    state.Edit_Id=Edit_id
    let Edit_obj=state.MyTodoArr.find(t=>t.id===Edit_id);
    todoName.value=Edit_obj.todoItem;
    isCompleted.value=Edit_obj.isCompleted ? "yes" : "no";
    addTodoBtn.classList.add("d-none");
    updateTodoBtn.classList.remove("d-none");

}

// update
async function Uphandler(ele){
    Handlespinner();
    let update_Id=state.Edit_Id;
    let Upobj={
        todoItem: todoName.value.trim(),
        isCompleted:isCompleted.value === "yes" ? true : false,
        id:update_Id

        }
        let Update_url=`${Base_url}/Mytodo/${update_Id}.json`
        try{
           let res= await fetch(Update_url,{
                method:"PATCH",
                body:JSON.stringify(Upobj),
                headers:{
                    "content-Type":"application/json",
                "Authorization":"TOKEN JWT FROM  LS"
        
                }
            })
            let data= await res.json();
            let index=state.MyTodoArr.findIndex(t => t.id ===update_Id )
            state.MyTodoArr[index]=Upobj;
            let li=document.getElementById(update_Id);
            li.innerHTML=`<div>
                                    <input onclick="checkbox(this)" type="checkbox" ${Upobj.isCompleted ? "checked" : ""}>
                                    <strong>${Upobj.todoItem}</strong>
                                </div>
                                <div>
                                    <i  onclick="EditLI(this)"class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                                    <i  onclick="RemoveLi(this)"class="fa-solid fa-trash-can fa-2x text-danger"></i>
                                </div>`
                        addTodoBtn.classList.remove("d-none");
                    updateTodoBtn.classList.add("d-none");
                    Snakbar("Todo Updated","success")

                    state.Edit_Id=null,
                    Form.reset();

            
        }catch (err){
            cl(err)

        }finally{
            Handlespinner();
        }
}


// Delete
async function RemoveLi(eve){
    let Remove_id= eve.closest("li").id;
    let result =await Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
});
  if (result.isConfirmed) {
    try{
        let Remove_url=`${Base_url}/Mytodo/${Remove_id}.json`
        Handlespinner();
        let res =await fetch(Remove_url,{
            method:"DELETE",
            body:null,
            headers:{ "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
        

            },
        });
        let data=await res.json();
        let index= state.MyTodoArr.findIndex(d=>d.id===Remove_id);
        state.MyTodoArr.splice(index,1)
        eve.closest("li").remove();
        Snakbar("Item Removed!","success")
    }catch (err){
        cl(err)

    }finally{
        Handlespinner();
    }
  }


}



// Statuschanged


async function checkbox(eve){
    Handlespinner();

    try{
        let checkId=eve.closest("li").id;
        let isCompleted=eve.checked;
        let CheckUrl=`${Base_url}/Mytodo/${checkId}.json`

        let res= await fetch(CheckUrl,{
            method:"PATCH",
            body:JSON.stringify({isCompleted:isCompleted}),
            headers:{
                "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
        
            }
        });
        let data= await res.json();
        let Localobj=state.MyTodoArr.find(t=> t.id===checkId);
        Localobj.isCompleted=isCompleted;

    }catch (err){
        cl(err)

    }finally{
        Handlespinner();
    }

}
Form.addEventListener("submit", Oncreate);
updateTodoBtn.addEventListener("click",Uphandler);