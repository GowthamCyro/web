import { useState } from 'react'
import axios from 'axios'

function App() {
  const [file, setFile] = useState();

  const fileUpload = () => {
    if(!file){
        console.log("No file is selected");
        return;
    }

    const fd = new FormData();
    fd.append('username',"work")
    fd.append('email','gowthamforwork@gmail.com')
    fd.append('password','123456')
    fd.append('fullName','Gowtham For Work')
    fd.append('avatar',file)

    axios.post('http://localhost:7000/api/v1/users/register',fd)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

  }

  return (
    <>
      <h2>Uploading Files in react</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
      <button onClick={fileUpload}>Upload</button>
    </>
  )
}

export default App
