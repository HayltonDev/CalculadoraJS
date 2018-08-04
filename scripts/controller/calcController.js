//essa é a classe que contém as regras de negócio
class CalcController {
    //método construtor é chamado automaticamente quando é feita uma nova instancia da classe
    constructor() {
        //this faz referência ao próprio objeto que foi instanciado, fazendo referencia a atributos e métodos
        this._lastOperator = '';
        this._lastNumber = '';
        this._audioOnOff = false; //de inicio o audio está desligado
        this._audio = new Audio('click.mp3'); //atributo para guardar o audio através da API de audio
        this._operation = [];
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate; //a convensão pra saber se  o atributo é privado é utilizado o underline no começo
        this._locale = "pt-BR";
        this.initialize();
        this.initButtonEvents();
        this.initKeyBoard();
    }
    

    initialize() {
        //se o código vai repetir, crie um método
        this.setDisplayDateTime();
        //essa função abaixo é do JS que atualiza o que esta dentro dela, e depois das chaves indica em quantos milesegundos
        setInterval(() => {
            this.setDisplayDateTime()
        }, 1000);

        this.setLestNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn =>{
            btn.addEventListener('dblclick', e=>{
                this.toggleAudio(); //método para saber se tá ligado ou não
            });
        });
    }

    toggleAudio(){
        this._audioOnOff = (this._audioOnOff) ? false : true;
        //outra forma mais faácil por ser boleando é  essa abaixo, se já era false, vai receber true, se era true, vai receber false. Por já começar false, se eu der double click em AC ele vai virar true
        //this._audioOnOff = !this._audioOnOff;
    }
    
    //método que realmente vai tocar o som
    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;//serve para forçar o audio a tocar mais rápido, pois quando apertava várias vezes rapidamente, não tocava direito o audio
            this._audio.play();
        }
    }


    //copiar da área de transferência, no caso por exemplo, copie do notepad++ e quero passar para a calculadora
    pasteFromClipboard(){
        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('Text');
            this.setDisplayCalc = parseFloat(text);
            //não preciso verificar se é um número ou não, pois o parseFloat só acontece se for um número e se não for devolve um NAN no display, simples
        });
    }

    //método para uso de ctrl c + ctrl v
    copyToClipboard(){
        let input = document.createElement('input');
        input.value = this.getDisplayCalc;
        document.body.appendChild(input); //é necessário fazer o appendchild pq o input não está até esse comando inserido no body para ser selecionado
        input.select(); //aqui ele está sendo selecionado 

        //agora copio a informação que está selecionada no input e copiar para o sistema operacional
        document.execCommand("Copy");

        input.remove(); //pq está sendo removido o input? pq simplesmente não uso input lá no display e sim uso SVG 
    }


    //método para inicializar os eventos de teclado
    initKeyBoard(){
        document.addEventListener('keyup', e=>{
            //pra tocar o audio
            this.playAudio();
            // console.log(e.key); //para ver o valor da tecla que foi pressionada
            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot();
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
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c': //se c foi pressionado com ctrl, chama o copy
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
    
    
            }
    
        });
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
        this._lastNumber = '';
        this._lastOperator = '';
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

    //aqui é o calculo de fato com o eval e com o join que irá juntar as index formando uma string
    getResult() {
        return eval(this._operation.join(""));
    }

    calc() {

        let last = '';
        this._lastOperator = this.getLastItem(); //sei que lá passa por padrão true, mas por garantia vou passar mesmo assim true para me retornar o ultimo simbolo que vai servir para os dois if abaixo
        
       
       if(this._operation.length < 3){ //esse daqui é o que dependo para que quando eu digito 3+3 =6 e click em mais um =, é para usar o último operador e o último operando, ou seja 3+3=6 +3 = 9
           
        let firstItem = this._operation[0];
        this._operation = [firstItem, this._lastOperator, this._lastNumber];


       }
        if (this._operation.length > 3) {
            last = this._operation.pop(); // vai tirar o ultimo item do array, no caso  um +, ou -, / *, pq funciona assim: se for digitado 5+5+ (esse segundo + digitado é para fazer a conta ali atrás e ser retirado)
            this._lastNumber = this.getResult(); //simplesmente quero guardar o resultado por exemplo de 2+3 que é 5, para que o botão igual some +5 que é isso que outras calculadora fazer

        }else if(this._operation.length ==3 ){ //se cair no primeiro if, não cai no else if

            this._lastNumber = this.getLastItem(false); //para me retornar o último número que ele tem.
       
        }

        console.log('_lastOperator:', this._lastOperator );
        console.log('_lastNumber:', this._lastNumber);

        let result = this.getResult();

        //depois do novo array atualizo na próxima instrução
        this._operation = [result, last];
        //validando o simbolo de porcentagem
        if (last == '%') {
            result /= 100;
            this._operation = [result];
        } else {

            //depois do novo array atualizo na próxima instrução
            this._operation = [result];

            if (last) this._operation.push(last);

        }



        //atualizando o diplay depois dos novos valores dentro do array
        this.setLestNumberToDisplay();




        //o Join ele pode subistituir o separador de um array que no caso é a virgula e sibstituir po qualquer coisa ou apenas juntar

    }

    //se eu não passo nada quando chamo esse método, por padrão ele é true significando que é um simbolo de operação, se eu passar, então possivelmente é falso e então serã um número
    getLastItem(isOperator = true) {
        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {
            if (this.isOperator(this._operation[i]) === isOperator){
                lastItem= this._operation[i];
                break;
            }
        }

        //não encontrou o lastItem?
        if(!lastItem){  //se for um operador, retorne esse atributo que está na memória, senão retorne o último número
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber; 
        }

        //retorno o ultimo item que estou procurando
        console.log('lastItem dentro do getLastItem', lastItem);
        return lastItem;

    }


    //tenho que verificar o último número array, não o último item do array
    setLestNumberToDisplay() {

        let lastNumber = this.getLastItem(false); //tenho que passar falso pq por padrão é true isso retornaria um simbolo e não um número

      
        //se for vazio, é zero, assim o display já começa com zero
        if (!lastNumber) lastNumber = 0;

        this.setDisplayCalc = lastNumber;



    }

    addOperation(value) {

        if (isNaN(this.getLestOperation())) {
            //String
            if (this.isOperator(value)) {
                //trocar o operador quando eu mudo de sinal na calculadora
                //ele só trocou o item
                this.setLastOperation(value);
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
                this.setLastOperation(newValue); //não preciso mais do parseFloat senão dá problemas com o ponto
                //atualizar display
                this.setLestNumberToDisplay();
            }

        }

    }

    setError() {
        this.setDisplayCalc = "Error";
    }

    addDot(){
            //lastoperation ão quer dizer ultimo operador tipo +, -, /, % e sim o que foi clicado por último
        let lastOperation =this.getLestOperation();
        
        //verifico primeiro se a operação já existe e se tá vindo nela um texto, depois tranformo em um array com split, com indexOf procuro o ponto, se retornar > -1 é que tem, se tem só sai do método com return;
        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;
        
        //se ele é um operador *,/,% - ou se não tem operador sendo undefined
        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        }else{
            // eu quero sobrescrever a minha ultima operação, só que não quero perde o número que eu tinha na minha operação
            this.setLastOperation(lastOperation.toString() + '.'); //preciso transformar pra toString se não não consigo concatenar 
        }

        this.setLestNumberToDisplay();
    }

    //decidir qual a ação desse botão
    execBtn(numero) {
        this.playAudio();
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
                this.addDot();
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
    set setDisplayCalc(value) {
        
        if(value.toString().length > 10){
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value;
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

