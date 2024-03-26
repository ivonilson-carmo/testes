
class SearchAPI{
    OFFSET = 0;
    LIMIT = 10;
    textSearch = '';

    findData(textCarrer){
        this.textSearch = (this.textSearch == '') ? textCarrer : this.textSearch;


        const url = (this.getTypeCareer() == "Salvador/BA" ) 
            ? `https://portal.api.gupy.io/api/v1/jobs?city=Salvador&jobName=${this.textSearch}&state=Bahia&limit=${this.LIMIT}&offset=${this.OFFSET}`
            : `https://portal.api.gupy.io/api/v1/jobs?jobName=${this.textSearch}&limit=${this.LIMIT}&offset=${this.OFFSET}&workplaceType=remote`

        
        fetch(url)
            .then( (response) => response.json() )
            .then( (response) => response.data)
            .then( (response) => response.map( (item) => {
                // Transforma data para o formato dd/mm/yyyy hh:mm
                const date = new Date(item.publishedDate);
                const dia = date.getDate().toString().padStart(2, 0);
                const mes = (date.getMonth() + 1).toString().padStart(2, 0);
                const ano = date.getFullYear();
                const horas = date.getHours();
                const minutos = date.getMinutes();
                // data formatada
                const dateFormated = `${dia}/${mes}/${ano} ${horas}:${minutos}`;

                // se o botão para carregar mais dados estiver oculto(com a classe hide)
                const classes = Array.from(document.querySelector('.loadMore').classList);
                if (classes.indexOf('hide') != -1){
                    // remove a classe que deixa ele oculto
                    document.querySelector('.loadMore').classList.toggle('hide');
                }

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
                response.map((item) => this.addCardCareer(item))
            })
    }

    nextData(){
        this.OFFSET += 10;
        this.findData();
    }

    addCardCareer(item){
        const layout = document.querySelector('section.data-career');

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

    getTextSearch(){
        return document.querySelector('#textCareer').value;
    }

    getTypeCareer(){
        // verifica se o filtro de busca para "salvador" está ativo
        const careerSalvador = document.querySelector('#career-salvador').checked;
        // se tiver ativo seleciona o tipo de vaga como "Salvador/BA"
        // se não -> remoto
        const tipoVaga = (careerSalvador) ?  "Salvador/BA" : "remoto";

        return tipoVaga;
    }

    clear(){
        this.textSearch = '';
        this.OFFSET = 0;
    }


}


const search = new SearchAPI();

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const textCarrer = new URLSearchParams({params: search.getTextSearch()}).get('params');

    // caso tenha algum testo digitado na barra de busca
    if (textCarrer){
        // limpa o layout para uma busca nova;
        document.querySelector('section.data-career').innerHTML = '';
        search.clear();
        // realiza busca de vagas de acordo com o parametro;
        search.findData(textCarrer);
    }
})


document.querySelector('.loadMore').addEventListener('click', () => {
    search.nextData();
})

