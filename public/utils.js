const utils = {
    createButton: (text) => {
        const buttonElement = document.createElement("button");
        const buttonSpan = document.createElement("span");
        buttonSpan.classList.add("button_top");
        buttonElement.append(buttonSpan);
        buttonSpan.append(text);

        return buttonElement;
    },

    openModal: (header, text, confirmAct, cancelAct) => {
        const modalBACK = document.createElement("div");
        modalBACK.classList.add("modalBACK")
    
        const modal = document.createElement("div");
        modal.classList.add("modal");
    
        const headerElement = document.createElement("div");
        headerElement.append(header);
        headerElement.classList.add("title");
        modal.append(headerElement)
    
        const textElement = document.createElement("div");
        textElement.append(text);
        modal.append(textElement)
    
        const buttonCont = document.createElement("div");
        buttonCont.classList.add("buttonCont");
        modal.append(buttonCont)
        
        modalBACK.append(modal)
        document.body.append(modalBACK)
    
        if(confirmAct){
            const confirmBut = utils.createButton(document.createTextNode("Confirm"))
            buttonCont.append(confirmBut)
    
            confirmBut.addEventListener("click", (e) => {
                removeSelf([modalBACK])
                confirmAct()
            });
        }
        if(cancelAct){
            const cancelBut = utils.createButton(document.createTextNode("Cancel"))
            buttonCont.append(cancelBut)
    
            cancelBut.addEventListener("click", (e) => {
                removeSelf([modalBACK])
                cancelAct()
            });
        }
    },

    removeSelf: (divs) => {
        divs.forEach(element => {
            element.parentNode.removeChild(element);
        });
    },

    removeAll: (div) => {
        while(div.firstChild){div.removeChild(div.firstChild)};
    },

    removeAllAndHide: (div) => {
        while(div.firstChild){div.removeChild(div.firstChild)};
        div.style.display = 'none';
    },

    Delay: (X) => new Promise((resolve, reject) => { setTimeout(resolve, X) }),
};



