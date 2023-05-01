var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");

Array.from(thumbUp).forEach(function (element) {
  element.addEventListener("click", function () {
    const [name, mood, date, thumbsUpCount, thumbsUpIcon, trashIcon] = [
      ...this.parentNode.parentNode.childNodes,
    ]
      .filter((arr) => arr.nodeName.includes("SPAN"))
      .map((item) => item.innerText.trim());
    // const name = this.parentNode.parentNode.childNodes[1].innerText;
    // const msg = this.parentNode.parentNode.childNodes[3].innerText;
    // const thumbUp = parseFloat(
    //   this.parentNode.parentNode.childNodes[5].innerText
    // );
    fetch("notionMockUp/thumbsUp", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        mood,
        date,
        thumbsUpCount,
        thumbsUpIcon,
        trashIcon,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload(true);
      });
  });
});

Array.from(trash).forEach(function (element) {
  element.addEventListener("click", function () {
    const [name, mood, date, thumbsUpCount, thumbsUpIcon, trashIcon] = [
      ...this.parentNode.parentNode.childNodes,
    ]
      .filter((arr) => arr.nodeName.includes("SPAN"))
      .map((item) => item.innerText.trim());

    // const entry = this.parentNode.parentNode.childNodes[1].innerText;
    // let newEntry = entry.replace(/\s/g, "");
    // const date = this.parentNode.parentNode.childNodes[3].innerText;
    //let newDate = date.replace(/\s/g, "");
    fetch("delete", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        mood,
        date,
        thumbsUpCount,
        thumbsUpIcon,
        trashIcon,
      }),
    }).then(function (response) {
      window.location.reload();
    });
  });
});
