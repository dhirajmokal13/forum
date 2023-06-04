const loadingBtn = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
const uname = document.getElementById("uname");
const otpGenerateBtn = document.getElementById("otpGenerateBtn");
const otpValidateteBtn = document.getElementById("otpValidateBtn");
const otpField = document.getElementById("otp");
otpGenerateBtn.addEventListener("click", () => {
  if (uname.value?.length > 0) {
    otpGenerateBtn.innerHTML = loadingBtn;
    otpGenerateBtn.disabled = true;
    uname.disabled = true;
    fetch(`/password/forget/generate`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ uname: uname.value }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.found) {
          otpGenerateBtn.classList.replace(
            "btn-outline-royal",
            "btn-outline-success"
          );
          otpGenerateBtn.innerHTML = "Otp Generated Successfully";
          uname.classList.add("is-valid");
          otp.disabled = false;
          otpValidateteBtn.disabled = false;

          otpValidateteBtn.addEventListener("click", () => {
            otpValidateteBtn.innerHTML = loadingBtn;
            otpValidateteBtn.disabled = true;
            otpField.disabled = true;
            fetch(`/password/forget/verify`, {
              method: "POST",
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
              body: JSON.stringify({ otpId: res.otpId, otp: otpField.value }),
            })
              .then((res) => res.json())
              .then((res) => {
                if (res.otpMatched) {
                  otpField.classList.add("is-valid");
                  otpValidateteBtn.classList.replace(
                    "btn-outline-royal",
                    "btn-outline-success"
                  );
                  otpValidateteBtn.innerHTML = `Otp Varified Successfully`;
                  document
                    .getElementById("changePwdFrm")
                    .classList.remove("d-none");

                    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                    const updatePasswordBtn = document.getElementById("updatePasswordBtn");
                    const newPassword = document.getElementById("nPwd");
                    const confirmPassword = document.getElementById("cPwd");
                    const newPasswordAlert = newPassword.nextElementSibling;
                    const confirmPasswordAlert = confirmPassword.nextElementSibling;
                    let validPassword = false;

                    newPassword.addEventListener('keyup', ()=>{
                        if(newPassword.value.match(passwordPattern)){
                          validPassword = true;
                          newPasswordAlert.classList.replace("invalid-feedback", "valid-feedback");
                          newPasswordAlert.innerHTML = "Valid Password";
                          if(newPassword.classList.contains('is-invalid')){ newPassword.classList.replace('is-invalid', 'is-valid'); } else { newPassword.classList.add('is-valid') }
                        } else {
                          validPassword = false;
                          newPasswordAlert.classList.replace("valid-feedback", "invalid-feedback");
                          newPasswordAlert.innerHTML = "Password must combination of Smallcase, Capitalcase, Number & special Character and length more than 8";
                          if(newPassword.classList.contains('is-valid')){ newPassword.classList.replace('is-valid', 'is-invalid'); } else { newPassword.classList.add('is-invalid') }
                        }
                    })

                    confirmPassword.addEventListener('keyup', ()=>{
                      if(newPassword.value === confirmPassword.value && validPassword){
                        confirmPasswordAlert.classList.replace("invalid-feedback", "valid-feedback");
                        confirmPasswordAlert.innerHTML = "Password Match";
                        if(confirmPassword.classList.contains('is-invalid')){ confirmPassword.classList.replace('is-invalid', 'is-valid'); } else { confirmPassword.classList.add('is-valid') }
                      } else {
                        confirmPasswordAlert.classList.replace("valid-feedback", "invalid-feedback");
                        confirmPasswordAlert.innerHTML = "Password Didn't Match";
                        if(confirmPassword.classList.contains('is-valid')){ confirmPassword.classList.replace('is-valid', 'is-invalid'); } else { confirmPassword.classList.add('is-invalid') }
                      }
                  })
                    updatePasswordBtn.addEventListener("click", ()=> {
                      if(newPassword.value === confirmPassword.value && validPassword){
                        updatePasswordBtn.innerHTML = loadingBtn;
                        updatePasswordBtn.disabled = true;
                        newPassword.disabled = true;
                        confirmPassword.disabled = true;
                        fetch(`/password/change`,{
                          method: "POST",
                          headers: {
                            "Content-type": "application/json; charset=UTF-8",
                          },
                          body: JSON.stringify({ uid: res.uid,  password: newPassword.value }),
                        }).then(res=>res.json())
                        .then(res=>{
                          console.log(res);
                          if(res.updated){
                            updatePasswordBtn.classList.replace( "btn-outline-royal", "btn-outline-success");
                            updatePasswordBtn.innerHTML = `Password Updated Successfully`;
                          } else {
                            updatePasswordBtn.classList.replace( "btn-outline-royal", "btn-outline-danger");
                            updatePasswordBtn.innerHTML = `Password Not Updated`;
                          }

                        }).catch(err=>console.error(err));
                      }
                    })

                } else {
                  otpField.classList.add("is-invalid");
                  otpValidateteBtn.classList.replace(
                    "btn-outline-royal",
                    "btn-outline-danger"
                  );
                  otpValidateteBtn.innerHTML = `Invalid Otp`;
                }
              })
              .catch((err) => console.log(err));
          });
        } else {
          otpGenerateBtn.classList.replace(
            "btn-outline-royal",
            "btn-outline-danger"
          );
          otpGenerateBtn.innerHTML = "Username/Email Not Found";
          uname.classList.add("is-invalid");
        }
      })
      .catch((err) => console.err(err));
  }
});
