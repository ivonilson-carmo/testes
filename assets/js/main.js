const LIMIT = 10;
let OFFSET = 0;


function addCardCareer(item){
    const layout = document.querySelector('section.data-career')


    layout.innerHTML += `
    <a href="${item.linkVaga}" class="item-career" target="_blank">
        <h2> ${item.nameVaga} </h2>
        <hr>

        <span> Empresa: ${item.nameEmpresa} </span>
        <span> Tipo: ${item.tipoTrabalho} </span>
        <span> Aberta desde : ${item.datePublicada} </span>
    </a>
    `;
}

function findData(textoSearch, tipoVaga){
    const url = (tipoVaga == "Salvador/BA" ) 
        ? `https://portal.api.gupy.io/api/v1/jobs?city=Salvador&jobName=${textoSearch}&state=Bahia&limit=${LIMIT}&offset=${OFFSET}`
        : `https://portal.api.gupy.io/api/v1/jobs?jobName=${textoSearch}&limit=${LIMIT}&offset=${OFFSET}&workplaceType=remote`

        
        let req = fetch(url)
        .then( (response) => response.json() )
        .then( (response) => response.data)
        .then( (response) => response.map( (item) => {
            const date = new Date(item.publishedDate);
            const dia = date.getDate().toString().padStart(2, 0);
            const mes = (date.getMonth() + 1).toString().padStart(2, 0);
            const ano = date.getFullYear();
            const horas = date.getHours();
            const minutos = date.getMinutes();

            const dateFormated = `${dia}/${mes}/${ano} ${horas}:${minutos}`;
            console.log(item)
            return {
                id: item.id,
                nameVaga: item.name,
                nameEmpresa: item.careerPageName,
                linkVaga: item.jobUrl,
                datePublicada: dateFormated,
                cidade: item.city,
                tipoTrabalho: (item.workplaceType == 'on-site') ? 'Presencial' : item.workplaceType 
            }
        } ))
        .then( (response) => {
            response.map((item) => addCardCareer(item))
        })
}


document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const textCarrer = document.querySelector('#textCareer').value;
    if (textCarrer){
        const careerRemoto = document.querySelector('#career-remote').checked;
        const careerSalvador = document.querySelector('#career-salvador').checked;
        const tipoVaga = (careerRemoto) ? "remoto" : "Salvador/BA";
    
        document.querySelector('section.data-career').innerHTML = '';
        OFFSET = 0
        findData(textCarrer, tipoVaga);
        
        document.querySelector('.loadMore').classList.toggle('hide')
    }
})


document.querySelector('.loadMore').addEventListener('click', () => {
    const textCarrer = document.querySelector('#textCareer').value;
    const careerRemoto = document.querySelector('#career-remote').checked;
    const careerSalvador = document.querySelector('#career-salvador').checked;
    const tipoVaga = (careerRemoto) ? "remoto" : "Salvador/BA";
    OFFSET += 10

    findData(textCarrer, tipoVaga)
})

