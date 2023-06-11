document.getElementsByName("deletePost").forEach((data) => {
  data.addEventListener("click", (e) => {
    fetch(
      `/question/delete?qid=${e.target.dataset.qid}&uname=${e.target.dataset.uname}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8", // Indicates the content
        },
      }
    )
      .then((data) => {
        if (data.ok) window.location.href = "/";
      })
      .catch((err) => console.error(err));
  });
});

const getSignupData = () => {
  return {
    name: document.getElementById("sname"),
    mobile: document.getElementById("smnumber"),
    email: document.getElementById("semail"),
    address: document.getElementById("saddr"),
    dob: document.getElementById("sdob"),
    uname: document.getElementById("suname"),
    password: document.getElementById("spassword"),
  };
};

const dataValidate = () => {
  return {
    name: (namei) => {
      const regex = /^[A-Za-z\s]+$/;
      return regex.test(namei);
    },
  };
};

document.getElementsByName("likeBtn").forEach((datas) => {
  datas.addEventListener("click", (e) => {
    if (e.target.dataset.login === "true") {
      fetch(`/api/likes?questionId=${e.target.dataset.qid}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json; charset=UTF-8", // Indicates the content
        },
      })
        .then((data) => data.json())
        .then((data) => {
          datas.innerHTML = `${data.Operation} ${data.Count}`;
        })
        .catch((err) => console.error(err));
    } else console.error("Please Login For Like");
  });
});

document.getElementById("searchBtn").addEventListener("click", () => {
  const searchTxt = document.getElementById("serachBox");
  searchTxt.value
    ? (location.href = `/search/${searchTxt.value}`)
    : console.error("Search box is Empty");
});

document.getElementsByName("answerRemove").forEach((removeBtns) => {
  removeBtns.addEventListener("click", (e) => {
    fetch(`/answer/delete?ansid=${e.target.dataset.ansid}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8", // Indicates the content
      },
    })
      .then((data) => {
        if (data.ok && data.status === 204) {
          swal({
            title: "Removed",
            text: "Answer is Successfully Removed",
            icon: "success",
          }).then(() => window.location.reload()); 
        }

      })
      .catch((err) => console.error(err));
  });
});

//Bootstrap toopltip code
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

//popover
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})