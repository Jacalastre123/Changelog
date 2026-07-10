
        const temp = document.getElementById("temp")
        const cardList = JSON.parse(localStorage.getItem("list")) || []
        const tempFileStash = JSON.parse(localStorage.getItem("file")) || []
        const addition = document.getElementById("addition")
        const addCard = document.getElementById("addCard")
        const fileSelect = addition.querySelector("#fileSelect")
        const container = document.getElementById("container")
        const headerCol = localStorage.getItem("headerCol") || false
        let updateMode = false
        
        let currentElement = null
        let isActive = false
        let nameGreeting = localStorage.getItem("name") || null
        function spawnTemp(title, colour, ver, file) {
            const tempClone = temp.content.cloneNode(true)
            const tempTitle = tempClone.querySelector("#title")
            const tempVer = tempClone.querySelector("#version")
            const tempCard = tempClone.querySelector(".card")
            const tempScreen = tempClone.querySelector("#screenshot")

            tempTitle.innerText = title
            tempCard.style.backgroundColor = colour
            tempVer.innerText = ver

            tempScreen.style.backgroundImage = "url('" + file.fileContent + "')"

            container.appendChild(tempClone)
        }

        function formListener() {

            addition.addEventListener("submit", e => {

                const title = addition.querySelector("#title")
                const colour = addition.querySelector("#colour")
                const description = addition.querySelector("#description")
                const changelog = addition.querySelector("#changelog")
                const files = addition.querySelector("#files")
                if (colour.value === "#ffffff") {
                    colour.value = "#D9D9D9"
                }
                if (!updateMode) {

                    cardList.push({
                        title: title.value,
                        version: 1.0,
                        colour: colour.value !== "#ffffff" ? colour.value: "#D9D9D9",
                        file: tempFileStash[tempFileStash.length - 1],
                        desc: description.value,
                        verInfo: changelog.value,
                        history: [
                    {
                        ver: 1.0,
                        change: changelog.value
                    }
                        ]
                    })
                    
                    spawnTemp(title.value, colour.value, 1.0, tempFileStash[tempFileStash.length - 1])
                    
                }
                else {
                    const card = [...document.querySelectorAll(".card")].indexOf(currentElement.parentElement)
                
                    cardList[card].title = title.value
                    cardList[card].version = Number(Number(cardList[card].version) + 0.1).toFixed(1)
                    cardList[card].colour = colour.value !== "#ffffff" ? colour.value: "#D9D9D9"
                    if (files.value !== "") {
                        cardList[card].file = tempFileStash[card]
                    }
                    cardList[card].desc = description.value
                    cardList[card].verInfo = changelog.value
                    cardList[card].history.push({
                        ver: cardList[card].version,
                        change: changelog.value
                    })

                    container.innerHTML = ""
                    setList()

                }
                title.value = "";
                description.value = "";
                colour.value = "#FFFFFF";
                fileSelect.innerText = "Select File"
                addition.querySelector("#files").filename = ""
                addCard.close()
                localStorage.setItem("list", JSON.stringify(cardList))

            })

        }

        function fileSetup() {
            const file = addition.querySelector("#files")
            file.addEventListener("change", event => {
                const theFile = event.target.files[0]
                const reader = new FileReader()
                reader.onload = (e) => {
                    console.log(theFile)
                    console.log(e)
                    if (!updateMode) {
                        tempFileStash.push({
                            name: theFile.name,
                            fileContent: e.target.result,
                            fullFile: event.target.files[0]
                        })
                    }
                    else if (file.filename !== "") {
                        const cardIndex = [...document.querySelectorAll(".card")].indexOf(currentElement.parentElement)
                        const stash = tempFileStash[cardIndex]
                        stash.name = theFile.name
                        stash.fileContent = e.target.result
                        stash.fullFile = event.target.files[0]

                    }
                    addition.querySelector("#screenView").src = e.target.result
                    console.log(tempFileStash[0].fileContent)
                    fileSelect.innerText = theFile.name
                    localStorage.setItem("file", JSON.stringify(tempFileStash))
                }
                reader.readAsDataURL(theFile)
            })

        }

        function setup() {
            formListener()
            setList()
            fileSetup()
            buttonListener()
            searchListener()
            colourSetup()
            starterDial()
            nameListener()
            ifEmpty()
        }

        function setList() {
            cardList.forEach(item => {
                spawnTemp(item.title, item.colour, item.version, item.file)

            })
        }

        function buttonListener() {
            document.addEventListener("click", e => {
                if (e.target.id === "moreInfo") {
                    const incInfo = document.getElementById("incInfo")
                    incInfo.showModal()
                    const cardPos = [...document.querySelectorAll(".card")].indexOf(e.target.parentElement)
                    incInfo.querySelectorAll("*").forEach((item) => {
                        if (item.id === "titleDial") {
                            item.innerText = cardList[cardPos].title
                        }
                        if (item.id === "verDial") {
                            item.innerText = cardList[cardPos].version
                        }
                        if (item.id === "screenDial") {
                            item.src = cardList[cardPos].file.fileContent
                        }
                        if (item.id === "descDial") {
                            item.innerText = cardList[cardPos].desc
                        }
                        if (item.id === "verInfoDial") {
                            item.innerText = cardList[cardPos].verInfo
                        }
                        if (item.id === "changeHistory") {
                            cardList[cardPos].history.forEach(changes => {
                                const verCata = document.getElementById("verCatagory")
                                const verTemp = verCata.content.cloneNode(true)
                                
                                verTemp.querySelector("#title").innerText = changes.ver
                                verTemp.querySelector("#content").innerText = changes.change
                                item.appendChild(verTemp)
                            })
                            
                        }
                        if (item.id === "close") {
                            item.addEventListener("click", e => {
                                incInfo.close()
                            })
                        }
                    })
                }
                if (e.target.id === "update") {
                    updateMode = true
                    currentElement = e.target
                    summonForm(true, e)

                }
                if (e.target.id === "add") addCard.showModal()
                if (e.target.id === "closeForm") addCard.close()
                if (e.target.id === "fileSelect") {
                    addition.querySelector("#files").click()
                }
                if (e.target.id === "customBg") {
                    const colourInput = document.getElementById("bgCo")
                    colourInput.click()
                    colourInput.addEventListener("input", (e) => {
                        document.querySelectorAll("dialog").forEach(dials => dials.style.backgroundColor = colourInput.value)
                        document.getElementById("header").style.backgroundColor = colourInput.value
                        localStorage.setItem("headerCol", colourInput.value)
                    })

                }
                if (e.target.id === "default") {
                    document.querySelectorAll("dialog").forEach(dials => dials.style.backgroundColor = colourInput.value)
                    document.getElementById("header").style.backgroundColor = "rgb(255, 170, 0)"
                    localStorage.setItem("headerCol", "rgb(255, 170, 0)")

                }
             
                if (e.target.id === "resetName") {
                    nameGreeting = null
                    starterDial()
                }
                if (e.target.id === "closeName") {
                    document.getElementById("dialName").close()
                    
                }
                if (e.target.id === "removeCard") {
                    const specCard = [...document.querySelectorAll(".card")].indexOf(e.target.parentElement)
                    
                    cardList.splice(specCard, 1)
     
                    localStorage.setItem("list", JSON.stringify(cardList))
                    e.target.parentElement.remove()
                    ifEmpty()
                }

            })

        }
        function summonForm(isUpdate, e) {

            const titleName = document.getElementById("titleName")
            const files = document.getElementById("files")
            addCard.showModal()
            if (!isUpdate) {
                files.required = true
                titleName.innerText = "Add Entry"
            }
            else {
                titleName.innerText = "Update " + e.target.parentElement.querySelector("#title").innerText
                const cardIndex = [...document.querySelectorAll(".card")].indexOf(e.target.parentElement)
                    files.required = false
                addCard.querySelectorAll("*").forEach(item => {
                    if (item.id === "title") {
                        item.value = cardList[cardIndex].title
                    }
                    if (item.id === "colour") {
                        item.value = cardList[cardIndex].colour
                    }
                    if (item.id === "screenView") {
                        item.src = cardList[cardIndex].file.fileContent
                    }
                    if (item.id === "description") {
                        item.value = cardList[cardIndex].desc
                    }

                })

            }
        }
        function searchListener() {
            const searchForm = document.getElementById("searchForm")
            searchForm.addEventListener("submit", e => {
                e.preventDefault()
                const search = searchForm.querySelector("#search")
                if (search.value.trim === "") {
                    document.querySelectorAll(".card").forEach(item => {
                        item.style.display = "block"
                    })

                }
                else {
                    document.querySelectorAll(".card").forEach(item => {
                        if (item.querySelector("#title").innerText.toLowerCase().includes(search.value.toLowerCase())) {
                            item.style.display = "block"
                        }
                        else {
                            item.style.display = "none"
                        }
                    })
                }

            })
        }
        function colourSetup() {
            if (headerCol) {
                document.getElementById("header").style.backgroundColor = headerCol
                document.querySelectorAll("dialog").forEach(dials => dials.style.backgroundColor = headerCol)
            }

        }
        function starterDial() {
            if (nameGreeting === null) {
            const dialName = document.getElementById("dialName")
            const name = dialName.querySelector("#devName")

            dialName.showModal()
            if (localStorage.getItem("name")) {
                name.value = localStorage.getItem("name")
            }
            name.parentElement.addEventListener("submit", e => {
                const greeting = document.getElementById("greeting")
                greeting.innerText = "Welcome " + name.value
                localStorage.setItem("name", name.value)
                nameGreeting = name.value
                dialName.close()
                
                
            })
           
        }
         else {
                const greeting = document.getElementById("greeting")
                greeting.innerText = "Welcome " + nameGreeting

            }
        }

        function nameListener() {
            const dialName = document.getElementById("dialName")
            const name = dialName.querySelector("#devName")
            name.addEventListener("input",e => {
                if (name.value.length > 14) {
                    name.value = name.value.substring(0,14)
                }
            })
        }

        function ifEmpty() {
            if (container.innerText === "") {
                const fillCont = document.getElementById("fillCont")
                const fillClone = fillCont.content.cloneNode(true)
                container.appendChild(fillClone)
            }
        }

        setup()
