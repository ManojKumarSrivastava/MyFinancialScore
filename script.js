const startBtn = document.getElementById("startBtn");
const formSection = document.getElementById("formSection");
const hero = document.querySelector(".hero");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const generate = document.getElementById("generate");
const bar = document.getElementById("bar");
const childrenContainer = document.getElementById("childrenContainer");

// Married Change
document.getElementById("married").addEventListener("change",function(){

    if(this.value=="Married"){

        document.getElementById("children").disabled=false;

    }else{

        document.getElementById("children").disabled=true;
        document.getElementById("children").value="";
        childrenContainer.innerHTML="";

    }

});

// Children Count Change -> Dynamic Gender + Age fields
document.getElementById("children").addEventListener("input",function(){

    let count=parseInt(this.value)||0;

    if(count>10) count=10;
    if(count<0) count=0;

    childrenContainer.innerHTML="";

    for(let i=1;i<=count;i++){

        let block=document.createElement("div");
        block.style.marginBottom="15px";
        block.style.padding="12px";
        block.style.border="1px solid #ddd";
        block.style.borderRadius="10px";
        block.style.background="#f7f9fc";

        block.innerHTML=`
            <p style="margin-bottom:10px;font-weight:600;color:#0f4c81;">Child ${i} Details</p>

            <select id="childGender_${i}" style="margin-bottom:10px;">
                <option value="">Child ${i} Gender</option>
                <option value="Boy">👦 Boy</option>
                <option value="Girl">👧 Girl</option>
            </select>

            <input type="number" id="childAge_${i}" placeholder="Child ${i} Age" min="0" max="30">
        `;

        childrenContainer.appendChild(block);

    }

});

// Start Button

startBtn.onclick=function(){

    hero.style.display="none";
    formSection.style.display="block";
    bar.style.width="100%";

};

// Generate Report

generate.onclick=function(){

    let name=document.getElementById("name").value;
    let mobile=document.getElementById("mobile").value;
    let age=parseInt(document.getElementById("age").value);
    let income=parseInt(document.getElementById("income").value);

    let married=document.getElementById("married").value;
    let gender=document.getElementById("gender").value;
    let children=parseInt(document.getElementById("children").value)||0;
    let goal=document.getElementById("goal").value;

    let childrenData=[];

    for(let i=1;i<=children;i++){

        let g=document.getElementById("childGender_"+i)?.value || "Not specified";
        let a=document.getElementById("childAge_"+i)?.value || "Not specified";

        childrenData.push(`Child ${i}: ${g}, Age ${a}`);

    }

    if(name=="" || mobile=="" || !age || !income){

        alert("Please fill all required fields.");
        return;

    }

    formSection.style.display="none";
    loading.style.display="block";

    setTimeout(function(){

        loading.style.display="none";
        result.style.display="block";

        let score=50;

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

        // Score Animation

        const circle=document.getElementById("progressCircle");

        const radius=75;
        const circumference=2*Math.PI*radius;

        circle.style.strokeDasharray=circumference;
        circle.style.strokeDashoffset=circumference;

        let current=0;

        const timer=setInterval(function(){

            current++;

            document.getElementById("score").innerHTML=current;

            const offset=circumference-(current/100)*circumference;

            circle.style.strokeDashoffset=offset;

            if(current>=score){

                clearInterval(timer);

            }

        },20);

        // Grade

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

        // Report

        let saving=Math.round(income*0.30);

        let insurance=Math.round(income*120);

        let emergency=Math.round(income*6);

        let retirement=Math.round(income*0.15);

        document.getElementById("saving").innerHTML=
        "💰 Recommended Monthly Saving : ₹"+saving.toLocaleString();

        document.getElementById("insurance").innerHTML=
        "🛡 Suggested Life Insurance Cover : ₹"+insurance.toLocaleString();

        document.getElementById("emergency").innerHTML=
        "🏦 Emergency Fund Target : ₹"+emergency.toLocaleString();

        document.getElementById("retirement").innerHTML=
        "👴 Retirement Investment Suggestion : ₹"+retirement.toLocaleString()+"/month";

        // ===== AI Advice Logic =====

        let aiMsg="";

        if(married=="Unmarried"){

            aiMsg="आपके पास सबसे बड़ी ताकत समय है। आज से SIP शुरू करें ताकि भविष्य में बड़ा Corpus बन सके।";

        }else if(married=="Married" && children==0){

            aiMsg="परिवार की सुरक्षा के लिए पर्याप्त Life Insurance और Emergency Fund बनाना प्राथमिकता रखें।";

        }else if(children>0){

            let hasGirl=childrenData.some(c=>c.includes("Girl"));
            let hasBoy=childrenData.some(c=>c.includes("Boy"));

            if(hasGirl && hasBoy){

                aiMsg="बेटी की शिक्षा और भविष्य के लिए दीर्घकालिक निवेश शुरू करें, और बेटे के लिए उच्च शिक्षा व Career Planning हेतु नियमित निवेश करें।";

            }else if(hasGirl){

                aiMsg="बेटी की शिक्षा और भविष्य के लिए दीर्घकालिक निवेश शुरू करें। यदि उपयुक्त हो तो कन्यादान/विवाह निधि जैसी योजनाओं पर भी विचार करें।";

            }else if(hasBoy){

                aiMsg="उच्च शिक्षा और Career Planning के लिए नियमित निवेश शुरू करें।";

            }

        }

        // Goal based advice (added on top)

        if(goal=="Wealth Creation"){

            aiMsg+=" हर महीने SIP/Investment बढ़ाकर लंबी अवधि में संपत्ति निर्माण पर ध्यान दें।";

        }else if(goal=="Retirement"){

            aiMsg+=" Retirement Corpus बनाने के लिए नियमित Pension/Retirement Investment शुरू करें।";

        }else if(goal=="Family Protection"){

            aiMsg+=" पर्याप्त Life Insurance, Health Insurance और Emergency Fund आपकी पहली प्राथमिकता होनी चाहिए।";

        }else if(goal=="Tax Saving"){

            aiMsg+=" ऐसे निवेश विकल्प चुनें जिनसे टैक्स बचत के साथ-साथ Wealth Creation भी हो।";

        }

        document.getElementById("aiMessage").innerHTML=aiMsg;

        // ===== WhatsApp Message =====

        let msg=`Hello Manoj Ji,

My Financial Score Report

Name : ${name}

Mobile : ${mobile}

Age : ${age}

Monthly Income : ₹${income}

Financial Goal : ${goal}

Score : ${score}/100${childrenData.length>0 ? "\nChildren Details:\n"+childrenData.join("\n") : ""}

Please guide me with a suitable financial plan.`;

        document.getElementById("whatsappBtn").href=
        "https://wa.me/919415612619?text="+encodeURIComponent(msg);

    },2500);

};
