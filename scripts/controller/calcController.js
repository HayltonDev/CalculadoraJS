//essa é a classe que contém as regras de negócio
class CalcController{
    //método construtor é chamado automaticamente quando é feita uma nova instancia da classe
    constructor(){
        //this faz referência ao próprio objeto que foi instanciado, fazendo referencia a atributos e métodos
        this._displayCalcEl=  document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl =  document.querySelector("#hora");
        this._currentDate; //a convensão pra saber se  o atributo é privado é utilizado o underline no começo
        this._locale = "pt-BR";
        this.initialize();
        this.initButtonEvents();
    }

    initialize(){
        //se o código vai repetir, crie um método
        this.setDisplayDateTime();
        //essa função abaixo é do JS que atualiza o que esta dentro dela, e depois das chaves indica em quantos milesegundos
      setInterval(()=>{
        this.setDisplayDateTime()
      },1000 );

      /*    
      let interval = setInterval(()=>{
        this.setDisplayDate = this.getCurrentDate.toLocaleDateString(this._locale);
        this.setDisplayTime = this.getCurrentDate.toLocaleTimeString(this._locale);
      },1000 );
      
      setTimeout(()=>{
        clearInterval(interval);
      }, 5000); //se eu quisses que parasse de atualizar a data e a hora*/
    }

    //método criado para tratar múltiplos eventos
    addEventListenerAll(element, events, fn){
        //o split é para substituir o espaço entre as duas palavras e vai transformar em um array
        //como o split vai transformar em um array, consigo fazer um forEach
       
        events.split(' ').forEach(event =>{
            //primeiro parâmetro dele é que evento que vocÊ quer, exemplo click, o segundo é o que eu devo fazer. O terceiro é caso ele click no botão e no texto ao mesmo tempo, não dispare o numero duas vezes
            element.addEventListener(event, fn, false); //pega esse elemento e adicione um evento para cada vez que rodar o forEach
        });

        
    }

    //inicializar os buttons, o seletor de > g, quer dizer pegue todas as tags g do filho de buttons

    initButtonEvents(){
       let buttons = document.querySelectorAll("#buttons > g, #parts > g");
       
       buttons.forEach((btn, index)=>{
       //primeiro parâmetro dele é que evento que vocÊ quer, exemplo click, o segundo é o que eu devo fazer. O e é o parametro da minha arrowFunction, isso é, se eu quiser falar algo sobre o button que foi chamado, eu falo algo    
        this.addEventListenerAll(btn,'click drag', e=>{ //addEventListener  é nativo do JS
            console.log(btn.className.baseVal.replace("btn-", ""));
        });

        this.addEventListenerAll(btn, "mouseover mouseup mousedown", e=>{
            btn.style.cursor = "pointer";
        });

       });

    }


    setDisplayDateTime(){
        this.setDisplayDate = this.getCurrentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month:"short",
            year:"numeric"
        });
        this.setDisplayTime = this.getCurrentDate.toLocaleTimeString(this._locale);
    }

    get getDisplayTime(){
        return this._timeEl.innerHTML;
    }

    get getDisplayDate(){
        return this._dateEl.innerHTML;
    }

    set setDisplayTime(value){
       this._timeEl.innerHTML = value;
    }

    set setDisplayDate(value){
        this._dateEl.innerHTML = value;
    }


    //recupera o valor
    get getDisplayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    //altera o valor
    set setDisplayCalc(valor){
        this._displayCalcEl.innerHTML = valor;
    }

    get getCurrentDate(){
        return new Date();
    }

    set setCurrentDate(value){
        this._currentDate = value;
    }

}
/* //dentro de uma classe vou encontrar variáveis e funções.
variáveis(atributos) serve para armazenar dados
funções(métodos) são ações/códigos que executam uma ação e retornam valor*/
//classe é um conjunto de atributos e métodos
//objetos representam uma classe, é abstração
//atributo é similar a uma variável, porém com mais recursos
//o processo de encapsulamento controla o acesso a um atributo ou método, é uma forma de proteger, constrolando quem chama ou quem acessa
/* métodos de acesso para atributos e métodos. Public é aberto pra todos, protected aberto apenas 
para atributos e métodos da mesma classe e classe Pai
Private somente atributos e métodos da própria classe
*/ 
/**
 * há somente duas cois a serem feitas com um atributo, ou eu recupero o valor que tá dentro dele
 * ou eu atribuo um valor para o atributo guardar 
 */
//************************************* */
/**aula c4-manipulando DOM(document object model)
 * DOM nada mais é a estrutura que o documento html se baseia, pra isso temos o objeto document lá
 * BOM nada mais é a estrutura do Browser, pra isso temos o objeto window lá
 * Eventos são ações disparadas na aplicação, usando o mousse, teclado ou outro
 * no DOM, cada tag hmtl vira um objeto da coleção HTMLDocument, com o ocmando na cosole do navegador dir(document) aparece os objetos html
 * 
 */

