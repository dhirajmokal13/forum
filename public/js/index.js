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
  const searchTxt = document.getElementById("serachBox").value;
  searchTxt ? location.href = `/search/${searchTxt}` : console.error("Search box is Empty");
});
