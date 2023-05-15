fetch('http://localhost:3000/items')
.then(function (res){
    return res.json();
})
.then(function (products){
    let placeholder = document.querySelector("#data-output");
    let out = "";
    for (let product of products){
        out+= `
        <tr>
            <td>${product.id}</td>
            <td>${product.amount}</td>
        </tr>
        `;
    }
    placeholder.innerHTML= out;
})

const formELement = document.getElementById('shopping-form')
    formELement.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("### test")

        /**
         * Get the element attached to the event handler.
         */
        let form = e.currentTarget;

        /**
         * Take the URL from the form's `action` attribute.
         */
        let url = form.action;

        try {
            /**
             * Takes all the form fields and make the field values
             * available through a `FormData` instance.
             */
            let formData = new FormData(form);

            /**
             * The `postFormFieldsAsJson()` function in the next step.
             */
            let responseData = await postFormFieldsAsJson({ url, formData });

            //Destructure the response data
            let { serverDataResponse } = responseData;

            //Display the response data in the console (for debugging)
            console.log(serverDataResponse);
        } catch (error) {
            //If an error occurs display it in the console (for debugging)
            console.error(error);
        }
    });

async function postFormFieldsAsJson({ url, formData }) {
    //Create an object from the form data entries
    let formDataObject = Object.fromEntries(formData.entries());
    // Format the plain form data as JSON
    let formDataJsonString = JSON.stringify(formDataObject);

    //Set the fetch options (headers, body)
    let fetchOptions = {
        //HTTP method set to POST.
        method: "POST",
        //Set the headers that specify you're sending a JSON body request and accepting JSON response
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        // POST request body as JSON string.
        body: formDataJsonString,
    };

    //Get the response body as JSON.
    //If the response was not OK, throw an error.
    let res = await fetch(url, fetchOptions);

    //If the response is not ok throw an error (for debugging)
    if (!res.ok) {
        let error = await res.text();
        throw new Error(error);
    }
    //If the response was OK, return the response body.
    return res.json();
}