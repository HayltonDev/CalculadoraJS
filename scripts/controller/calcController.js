//essa é a classe que contém as regras de negócio
class CalcController {
    //método construtor é chamado automaticamente quando é feita uma nova instancia da classe
    constructor() {
        //this faz referência ao próprio objeto que foi instanciado, fazendo referencia a atributos e métodos
        this._operation = [];
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate; //a convensão pra saber se  o atributo é privado é utilizado o underline no começo
        this._locale = "pt-BR";
        this.initialize();
        this.initButtonEvents();
    }

    initialize() {
        //se o código vai repetir, crie um método
        this.setDisplayDateTime();
        //essa função abaixo é do JS que atualiza o que esta dentro dela, e depois das chaves indica em quantos milesegundos
        setInterval(() => {
            this.setDisplayDateTime()
        }, 1000);

        this.setLestNumberToDisplay();
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
    addEventListenerAll(element, events, fn) {
        //o split é para substituir o espaço entre as duas palavras e vai transformar em um array
        //como o split vai transformar em um array, consigo fazer um forEach

        events.split(' ').forEach(event => {
            //primeiro parâmetro dele é que evento que vocÊ quer, exemplo click, o segundo é o que eu devo fazer. O terceiro é caso ele click no botão e no texto ao mesmo tempo, não dispare o numero duas vezes
            element.addEventListener(event, fn, false); //pega esse elemento e adicione um evento para cada vez que rodar o forEach
        });


    }

    //método para limpar tudo
    clearAll() {
        this._operation = [];
        this.setLestNumberToDisplay();
    }

    clearEntry() {
        this._operation.pop();
        this.setLestNumberToDisplay();
    }


    getLestOperation() {
        return this._operation[this._operation.length - 1];
    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value) {
        //o indexOf vai buscar aqui dentro se o value é igual a algum
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
        //vai retornar true se for 0 pra fremte e falso e foi -1

    }

    //responsável por verificar se tenho um par de numero com sinal e já calcular, para mostrar a operação acontecendo em pares
    pushOperation(value) {
        this._operation.push(value);
        if (this._operation.length > 3) {
            this.calc(); //chamo efetivamente o método para calcular

        }
    }


    calc() {
        
        let last = '';

        if(this._operation > 3){
            last = this._operation.pop(); // vai tirar o ultimo item do array, no caso  um +, ou -, / *, pq funciona assim: se for digitado 5+5+ (esse segundo + digitado é para fazer a conta ali atrás e ser retirado)
        }
       
        let result = eval(this._operation.join(""));

        //depois do novo array atualizo na próxima instrução
        this._operation = [result, last];
        //validando o simbolo de porcentagem
        if(last == '%'){
            result /= 100;
            this._operation = [result];
        }else {

            //depois do novo array atualizo na próxima instrução
            this._operation = [result];

            if(last) this._operation.push(last);

        }
        
       

        //atualizando o diplay depois dos novos valores dentro do array
        this.setLestNumberToDisplay();




        //o Join ele pode subistituir o separador de um array que no caso é a virgula e sibstituir po qualquer coisa ou apenas juntar

    }

    //tenho que verificar o último número array, não o último item do array
    setLestNumberToDisplay() {

        let lastNumber;

        for(let i = this._operation.length -1; i >=0; i--){
            if(!this.isOperator(this._operation[i])){
                lastNumber = this._operation[i];
                break;
            }
        }

        //se for vazio, é zero, assim o display já começa com zero
        if(!lastNumber) lastNumber = 0;

        this.setDisplayCalc = lastNumber;

        

    }

    addOperation(value) {

        if (isNaN(this.getLestOperation())) {
            //String
            if (this.isOperator(value)) {
                //trocar o operador quando eu mudo de sinal na calculadora
                //ele só trocou o item
                this.setLastOperation(value);
            } else if (isNaN(value)) {
                //Outra coisa
                console.log('outra coisa', value);
            } else {
                this.pushOperation(value);
                //isso pq é um número e quando eu clicava em um número, não aparecia o primeiro, apenas o segundo
                this.setLestNumberToDisplay();
            }


        } else {

            if (this.isOperator(value)) {

                this.pushOperation(value);

            } else {
                //Number
                let newValue = this.getLestOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));
                //atualizar display
                this.setLestNumberToDisplay();
            }

        }

}

setError(){
    this.setDisplayCalc = "Error";
}

//decidir qual a ação desse botão
execBtn(numero) {

    switch (numero) {
        case 'ac':
            this.clearAll();
            break;
        case 'ce':
            this.clearEntry();
            break;
        case 'soma':
            this.addOperation('+');
            break;
        case 'subtração':
            this.addOperation('-');
            break;
        case 'divisao':
            this.addOperation('/');
            break;
        case 'multiplicacao':
            this.addOperation('*');
            break;
        case 'porcento':
            this.addOperation('%');
            break;
        case 'igual':
            this.calc();
            break;
        case 'ponto':
            this.addOperation('.');
            break;

        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            this.addOperation(parseInt(numero));
            break;

        default:
            this.setError();
            break;


    }

}


//inicializar os buttons, o seletor de > g, quer dizer pegue todas as tags g do filho de buttons

initButtonEvents() {
    let buttons = document.querySelectorAll("#buttons > g, #parts > g");

    buttons.forEach((btn, index) => {
        //primeiro parâmetro dele é que evento que vocÊ quer, exemplo click, o segundo é o que eu devo fazer. O e é o parametro da minha arrowFunction, isso é, se eu quiser falar algo sobre o button que foi chamado, eu falo algo    
        this.addEventListenerAll(btn, 'click drag', e => { //addEventListener  é nativo do JS
            let textBtn = btn.className.baseVal.replace("btn-", "");
            this.execBtn(textBtn);
        });

        this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
            btn.style.cursor = "pointer";
        });

    });

}


setDisplayDateTime() {
    this.setDisplayDate = this.getCurrentDate.toLocaleDateString(this._locale, {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
    this.setDisplayTime = this.getCurrentDate.toLocaleTimeString(this._locale);
}

get getDisplayTime() {
    return this._timeEl.innerHTML;
}

get getDisplayDate() {
    return this._dateEl.innerHTML;
}

set setDisplayTime(value) {
    this._timeEl.innerHTML = value;
}

set setDisplayDate(value) {
    this._dateEl.innerHTML = value;
}


//recupera o valor
get getDisplayCalc() {
    return this._displayCalcEl.innerHTML;
}

//altera o valor
set setDisplayCalc(valor) {
    this._displayCalcEl.innerHTML = valor;
}

get getCurrentDate() {
    return new Date();
}

set setCurrentDate(value) {
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

