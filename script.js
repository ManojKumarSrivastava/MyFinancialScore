
document.getElementById("married").addEventListener("change",function(){

if(this.value=="Married"){

document.getElementById("children").disabled=false;

document.getElementById("childGender").disabled=false;

document.getElementById("childAge").disabled=false;

}else{

document.getElementById("children").disabled=true;

document.getElementById("childGender").disabled=true;

document.getElementById("childAge").disabled=true;

document.getElementById("children").value="";

document.getElementById("childGender").value="";

document.getElementById("childAge").value="";

}

});
const startBtn = document.getElementById("startBtn");
const formSection = document.getElementById("formSection");
const hero = document.querySelector(".hero");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const generate = document.getElementById("generate");
const bar = document.getElementById("bar");

startBtn.onclick = () => {
    hero.style.display = "none";
    formSection.style.display = "block";
    bar.style.width = "100%";
};

generate.onclick = () => {
    
    let name = document.getElementById("name").value;
    let mobile = document.getElementById("mobile").value;
    let age = parseInt(document.getElementById("age").value);
    let income = parseInt(document.getElementById("income").value);
    let children = parseInt(document.getElementById("children").value) || 0;
    let goal = document.getElementById("goal").value;

    let gender = document.getElementById("gender").value;
    let married = document.getElementById("married").value;
    let childGender = document.getElementById("childGender").value;
    let childAge = document.getElementById("childAge").value;

    if(name=="" || mobile=="" || age=="" || income==""){
        alert("Please fill all required fields.");
        return;
    }

    formSection.style.display="none";
    loading.style.display="block";

    setTimeout(function(){

        loading.style.display="none";
        result.style.display="block";

        let score = 50;

        if(income>=100000){
            score+=30;
        }else if(income>=50000){
            score+=20;
        }else if(income>=30000){
            score+=15;
        }else{
            score+=10;
        }

        if(age>=25 && age<=45){
            score+=10;
        }

        if(children>0){
            score+=5;
        }

        if(score>100) score=100;

        const circle = document.getElementById("progressCircle");

const radius = 75;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference;

let current = 0;

const timer = setInterval(() => {

    current++;

    document.getElementById("score").innerHTML = current;

    const offset = circumference - (current / 100) * circumference;

    circle.style.strokeDashoffset = offset;

    if (current >= score) {
        clearInterval(timer);
    }

}, 20);

        let grade="";

        if(score>=85){
            grade="Excellent Financial Health";
        }else if(score>=70){
            grade="Good Financial Health";
        }else if(score>=55){
            grade="Average Financial Health";
        }else{
            grade="Needs Immediate Planning";
        }

        document.getElementById("grade").innerHTML=grade;

        let saving=Math.round(income*0.30);

        let emergency=Math.round(income*6);

        let insurance=Math.round(income*120);

        let retirement=Math.round(income*0.15);

        document.getElementById("saving").innerHTML=
        "💰 Recommended Monthly Saving : ₹"+saving;

        document.getElementById("insurance").innerHTML=
        "🛡 Suggested Life Insurance Cover : ₹"+insurance.toLocaleString();

        document.getElementById("emergency").innerHTML=
        "🏦 Emergency Fund Target : ₹"+emergency.toLocaleString();

        document.getElementById("retirement").innerHTML=
        "👴 Retirement Investment Suggestion : ₹"+retirement+"/month";

        let aiText="";
        
if(goal=="Wealth Creation"){

aiText=
`📈 आपकी आय ₹${income.toLocaleString()} प्रति माह है।

💰 लगभग ₹${saving.toLocaleString()} प्रति माह निवेश करना लाभदायक रहेगा।

🛡 पर्याप्त जीवन बीमा अवश्य रखें।

⭐ नियमित निवेश से आप मजबूत संपत्ति बना सकते हैं।`;

}

else if(goal=="Retirement"){

aiText=
`👴 अब से Retirement Planning शुरू करना उचित रहेगा।

💰 लगभग ₹${retirement.toLocaleString()} प्रति माह निवेश करें।

🏦 Emergency Fund भी बनाएं।

⭐ भविष्य सुरक्षित रहेगा।`;

}

else if(goal=="Tax Saving"){

aiText=
`💼 Tax Saving के साथ Wealth Creation भी जरूरी है।

🛡 ऐसा निवेश चुनें जिससे टैक्स बचत और सुरक्षा दोनों मिलें।`;

}

else if(goal=="Family Protection"){

aiText=
`👨‍👩‍👧 परिवार की सुरक्षा सबसे पहले।

🛡 पर्याप्त Life Insurance रखें।

🏦 Emergency Fund बनाएं।

⭐ परिवार आर्थिक रूप से सुरक्षित रहेगा।`;

}

else{

aiText=
`🎓 बच्चों के भविष्य के लिए अभी से योजना बनाना उचित रहेगा।

💰 नियमित निवेश करें।

⭐ समय सबसे बड़ी ताकत है।`;

}

document.getElementById("aiMessage").innerHTML=aiText;

        let msg=
`Hello Manoj Ji,

My Financial Score Report

Name : ${name}

Mobile : ${mobile}

Age : ${age}

Monthly Income : ₹${income}

Financial Goal : ${goal}

Score : ${score}/100

Please guide me with a suitable financial plan.`;

        document.getElementById("whatsappBtn").href=
        "https://wa.me/919415612619?text="+encodeURIComponent(msg);

    },2500);

};
