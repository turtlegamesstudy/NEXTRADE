document.addEventListener("DOMContentLoaded",()=>{

const loader=document.getElementById("loader")
const openBtn=document.getElementById("openSorpresa")
const modal=document.getElementById("sorpresaModal")
const closeBtn=document.querySelector(".close-modal")
const slides=document.querySelectorAll(".slide")
const startBtn=document.getElementById("startExperience")
const daysCounter=document.getElementById("daysCounter")
const audio=document.getElementById("audio")
const audioBtn=document.getElementById("playAudio")

let current=0

window.onload=()=>{
setTimeout(()=>{
loader.style.display="none"
},1500)
}

openBtn.onclick=()=>{
modal.classList.add("active")
update()
}

closeBtn.onclick=()=>{
modal.classList.remove("active")
audio.pause()
}

function update(){
slides.forEach((s,i)=>{
s.style.transform=`translateY(${100*(i-current)}%)`
})
}

function next(){
if(current<slides.length-1){
current++
update()
}
}

startBtn.onclick=next

window.addEventListener("wheel",(e)=>{
if(!modal.classList.contains("active"))return
if(e.deltaY>0)next()
})

function counter(){
const start=new Date("2025-10-14")
const now=new Date()
const diff=Math.floor((now-start)/(1000*60*60*24))
daysCounter.textContent=diff
}

setInterval(counter,1000)

audioBtn.onclick=()=>{
if(audio.paused){
audio.play()
audioBtn.textContent="⏸"
}else{
audio.pause()
audioBtn.textContent="▶"
}
}

})
