async function askAI(){

const q=document.getElementById("q").value;

const res=await fetch("/api/ai",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({question:q})
});

const data=await res.json();

document.getElementById("answer").innerText=data.answer;
}
