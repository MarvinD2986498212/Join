let users = [
    {
        'email':'marvin@t-online.de','password' : 'test123',
    }
]

rememberBulian = true;

function iconWhiteToBlue() {
    let icon = document.getElementById('icon');
    if(window.innerWidth < 750){
        icon.src = '../assets/img/join-icon-white.png';
        setTimeout(changeIcon, 700)
    }
    setTimeout(zIndexChange, 900)
}

function changeIcon() {
    icon.src = '../assets/img/join-icon-blue.png';
}

function zIndexChange() {
    document.getElementById('whiteB').style.zIndex ="-1";
}

function signUp() {
    let logIn = document.getElementById('logIn');
    logIn.innerHTML = ``; 
    logIn.innerHTML += /*HTML*/ `

        <img onclick="backToLogIn()" class="backArrow hover" src="../assets/img/arrow-left-line.png">
        <div id="headline" class="headline">
            <h1>Sign up</h1>
            <div class="line"></div>
        </div>

        <div class="logInSection">
            <div class="inputfield">
                <input type="text" placeholder="Name" required>
                <div class="inputIcons">
                    <img class="personIcon hover" src="../assets/img/person.png">
                </div>
            </div>
            <div class="inputfield">
                <input id="email" type="text" placeholder="Email" required>
                <div class="inputIcons">
                    <img class="mailIcon hover" src="../assets/img/mail.png">
                </div>
            </div>
            <div class="inputfield">
                <input id="password" type="text" placeholder="Password" required>
                <div class="inputIcons">
                    <img class="lockIcon hover" src="../assets/img/lock.png">
                </div>
            </div>
            <div class="inputfield">
                <input type="text" placeholder="Confrim Password" required>
                <div class="inputIcons">
                    <img class="lockIcon hover" src="../assets/img/lock.png">
                </div>
            </div>
        </div>

        <div class="acceptPolicy">
            <img src="../assets/img/Property 1=Default.png" id="checkButton" class="checkButton hover" onclick="remember()"></button>
            <span> I Accept the <a href="../html/privacy_policy.html" class="blueText">Privacy policy</a></span>
        </div>
        <div class="signInButtonSection">
            <button class="signInButton hover" onclick="signUpSuccessful()">Sign up</button>
        </div>
    </div>

    <div class="informationSection">
        <span class="hover">Privacy Policy</span>
        <span class="hover">Legal notice</span>
    </div>
    `; 
        document.getElementById('headline').style.marginTop = '0px';
    document.getElementById('signUpSection').style.display ="none";
}

function remember(){
    if (rememberBulian == true) {
        document.getElementById('checkButton').src = '../assets/img/Property 1=hover checked.png';
        rememberBulian = false;
    }
    else {
        document.getElementById('checkButton').src = '../assets/img/Property 1=Default.png';
        rememberBulian = true;
    }
}

function backToLogIn() {
    let logIn = document.getElementById('logIn');
    logIn.innerHTML = ``; 
    logIn.innerHTML += /*HTML*/ `
          <div class="headline">
            <h1>Log in</h1>
            <div class="line"></div>
        </div>

        <div class="logInSection">
            <div class="inputfield">
                <input type="text" placeholder="Email" required>
                <div class="inputIcons">
                    <img class="mailIcon hover" src="../assets/img/mail.png">
                </div>
            </div>
            <div class="inputfield">
                <input type="text" placeholder="Password" required>
                <div class="inputIcons">
                    <img class="lockIcon hover" src="../assets/img/lock.png">
                </div>
            </div>
            <div class="rememberSection">
                <img src="../assets/img/Property 1=Default.png" id="checkButton" class="checkButton hover" onclick="remember()"></button>
                <span>Remember me</span>
            </div>
        </div>

        <div class="logInButtonSection">
            <button class="logInUserButton hover">Log in</button>
            <button class="logInGuestButton hover" >Guest Log in</button>
        </div>
    </div>

    <div class="informationSection">
        <span class="hover">Privacy Policy</span>
        <span class="hover">Legal notice</span>
    </div>
    `;
    document.getElementById('signUpSection').style.display = "block";
}

function signUpSuccessful(){
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    users.push({email: email.value, password: password.value});

    if(rememberBulian==false){
    document.getElementById('logIn').innerHTML += /*HTML*/`
        <div id="signInSuccessful" class="signInSuccessful">You Signed Up successful</div>
    `;
    setTimeout(backToLogIn, 1600);
    }
    else{
        document.getElementById('logIn').innerHTML += /*HTML*/`
        <div id="signInNoSuccessful" class="signInSuccessful">You Signed Up is not successful</div>
        `;
        setTimeout(removeNoSuccessfullSignUp, 2000);
    }
}

function logIn(){
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = users.find(u => u.email == email.value && u.password == password.value);
    
    if(user){
        console.log('user gefunden')
        document.getElementById('logIn').innerHTML += /*HTML*/`
        <div id="signInNoSuccessful" class="signInSuccessful">Sign in successful</div>
        `;
        setTimeout(openSummary, 2000);
    }
    else{
        document.getElementById('logIn').innerHTML += /*HTML*/`
        <div id="signInNoSuccessful" class="signInSuccessful">You must enter an email and password</div>
        `;
         setTimeout(removeNoSuccessfullSignUp, 2000);
    }
}

function removeNoSuccessfullSignUp(){
    document.getElementById('signInNoSuccessful').remove();
}

function openSummary(){
    window.location = 'summary.html';
}
