document.addEventListener("DOMContentLoaded",()=>{

const loader=document.getElementById("loader")
const openBtn=document.getElementById("openSorpresa")
const modal=document.getElementById("sorpresaModal")
const closeBtn=document.querySelector(".close-modal")
const daysCounter=document.getElementById("daysCounter")
const audio=document.getElementById("audio")
const audioBtn=document.getElementById("playAudio")

/* ===== LOADER ===== */
window.onload=()=>{
setTimeout(()=>loader.style.display="none",1500)
}

/* ===== MODAL ===== */
openBtn.onclick=()=>{
modal.classList.add("active")
document.body.style.overflow="hidden"
}

closeBtn.onclick=()=>{
modal.classList.remove("active")
document.body.style.overflow="auto"
audio.pause()
}

/* ===== CONTADOR ===== */
function counter(){
const start=new Date("2025-10-14")
const now=new Date()
const diff=Math.floor((now-start)/(1000*60*60*24))
daysCounter.textContent=diff
}
setInterval(counter,1000)

/* ===== AUDIO ===== */
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
