// Initialize variables
var clientList = document.querySelector("#client-list");
var form = document.querySelector("form");
var submitBtn = document.querySelector("#submit-btn");

// Create entry
async function createClient(name, email, phone, status, entryDate) {
  try {
    var docRef = await db.collection("clients").add({
      name: name,
      email: email,
      phone: phone,
      status: status,
      entryDate: entryDate
    });
    form.reset();
    await readClient();
    // const successMessage = document.getElementById("successMessage");
    // successMessage.style.display = "block";
    console.log("data add successfully", docRef.id)
  }
  catch (error) {
    console.error("Error adding document: ", error);
  }
}


// Read entries
async function readClient() {
  clientList.innerHTML = "";
  try {
    var querySnapshot = await db.collection("clients").get();

    querySnapshot.forEach((doc) => {
      var client = doc.data();
      var row = `
        <tr>
          <td>${client.name}</td>
          <td>${client.email}</td>
          <td>${client.phone}</td>
          <td>${client.status}</td>
          <td>${client.entryDate}</td>
          <td>
          <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalCenter" onclick="editClient('${doc.id}', '${client.name}', '${client.email}', '${client.phone}', '${client.status}', '${client.entryDate}')"><i class="bx bx-edit-alt me-1"></i></button>
          <button type="button" class="btn btn-danger btn-sm" onclick="deleteClient('${doc.id}')"><i class="bx bx-trash me-1"></i></button>
          </td>
        </tr>`;
        clientList.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    console.error("Error reading documents: ", error);
  }
}

// Update entry
async function updateClient(id, name, email, phone, status, entryDate) {
  try {
    await db.collection("clients").doc(id).update({
      name: name,
      email: email,
      phone: phone,
      status: status,
      entryDate: entryDate
    });
    console.log("Document successfully updated!");
    form.reset();
    location.reload();
    submitBtn.innerHTML = "Save Change";
    submitBtn.removeAttribute("data-id");
    submitBtn.removeEventListener("click", updateClient);
    // submitBtn.addEventListener("click", createClient);
  } 
  catch (error) {
    console.error("Error updating document: ", error);
  }
  await readClient();
}

// Edit entry
async function editClient(id, name, email, phone, status, entryDate) {
  document.querySelector("#nameWithTitle").value = name;
  document.querySelector("#emailWithTitle").value = email;
  document.querySelector("#phoneWithTitle").value = phone;
  document.querySelector("#statusWithTitle").value = status;
  document.querySelector("#entryDateWithTitle").value = entryDate;
  submitBtn.innerHTML = "Update Change";
  submitBtn.setAttribute("data-id", id);
  submitBtn.removeEventListener("click", createClient);
  submitBtn.addEventListener("click", async function(event) {
    event.preventDefault();
    var id = event.target.getAttribute("data-id");
    var name = document.querySelector("#nameWithTitle").value;
    var email = document.querySelector("#emailWithTitle").value;
    var phone = document.querySelector("#phoneWithTitle").value;
    var status = document.querySelector("#statusWithTitle").value;
    var entryDate = document.querySelector("#entryDateWithTitle").value;
    await updateClient(id, name, email, phone, status, entryDate);
  });
}

// Delete entry
async function deleteClient(id) {
  try {
    await db.collection("clients").doc(id).delete();
    // alert("Document successfully deleted!");
    return confirm("Are You Sure!")
    await readClient();
  } 
  catch (error) {
    console.error("Error removing document: ", error);
  }
}


// Add event listener for form submission
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  var name = document.querySelector("#nameWithTitle").value;
  var email = document.querySelector("#emailWithTitle").value;
  var phone = document.querySelector("#phoneWithTitle").value;
  var status = document.querySelector("#statusWithTitle").value;
  var entryDate = document.querySelector("#entryDateWithTitle").value;
  var id = submitBtn.getAttribute("data-id");
  if (id) {
    await updateClient(id, name, email, phone, status, entryDate);
  } else {
    await createClient(name, email, phone, status, entryDate);
  }
});

// Call readClient function on page load
readClient();
