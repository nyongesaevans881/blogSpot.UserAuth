//Front-end Logic to handle the forms and animation
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener('click', () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener('click', () => {
    container.classList.remove("sign-up-mode");
});


function processingComplete() {
    processing.innerHTML = 'Processing Data.!! Please Wait...';
    hide.style.display = 'block';
}

function processingFailure() {
    processing.innerHTML = '';
    hide.style.display = 'none';
};




//Back-end  logic to handle login forms
const signInForm = document.querySelector('.sign-in-form');  // Use querySelector for class selection
const emailErrorLogin = document.querySelector('.email.error.login');
const passwordErrorLogin = document.querySelector('.password.error.login');
const processing = document.querySelector('.processing');
const hide = document.querySelector('.hide');

 signInForm.addEventListener('submit', async(e) => {
 e.preventDefault();

 processingComplete();

 emailErrorLogin.innerHTML ='';
 passwordErrorLogin.innerHTML = '';    
 
 const email = signInForm.email.value;
 const password = signInForm.password.value;

 try{
     const res =  await fetch('/login', {
         method: 'POST',
         body: JSON.stringify({ email, password }),
         headers: { 'Content-Type': 'application/json' }
     });

     const data = await res.json();
 
     //reset loading message
    processingFailure();
    console.log(data);

     if(data.errors){
        emailErrorLogin.innerHTML = data.errors.email;
        passwordErrorLogin.innerHTML = data.errors.password;
        console.log(data.errors)
     }
     setTimeout(() => {
     if(data.user){
         location.assign('/dashboard')
     }
 }, 1000);
 }
 catch(err){
     console.log(err);
 }
 });


 // Back-end logic to handle sign up forms
 const signUpForm = document.querySelector('.sign-up-form');  // Use querySelector for class selection
 const emailErrorRegister = document.querySelector('.email.error.register');
 const passwordErrorRegister = document.querySelector('.password.error.register');
 
 signUpForm.addEventListener('submit', async (e) => {
 e.preventDefault();

 processingComplete();

 emailErrorRegister.innerHTML ='';
 passwordErrorRegister.innerHTML = '';    
 
 const name = signUpForm.name.value;
 const email = signUpForm.email.value;
 const password = signUpForm.password.value;

 try{
     const res =  await fetch('/signup', {
         method: 'POST',
         body: JSON.stringify({ name, email, password }),
         headers: { 'Content-Type': 'application/json' }
     });

     const data = await res.json();

    //reset loading message
    processingFailure();
    console.log(data);
     
     if(data.errors){
        emailErrorRegister.innerHTML = data.errors.email;
        passwordErrorRegister.innerHTML = data.errors.password;
     }
     if(data.user){
         location.assign('/dashboard')
     }
 }
 catch(err){
     console.log(err);
 }
 });



