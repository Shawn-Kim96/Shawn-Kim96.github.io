const auth1 = "github_pat_11A";
const auth2 = "MT6AMI0WyCbwOh";
const auth3 = "LNLWQ_jKZvwsqQ";
const auth4 = "df9uUgvJfPGtQ8";
const auth5 = "TUP9ajrLct5NWo";
const auth6 = "V9gMUMIEYMCYTN";
const auth7 = "L7E0hIerj";

const githubUrl =
  "https://api.github.com/repos/shawn-kim96/shawn-kim96.github.io";

var auth = auth1 + auth2 + auth3 + auth4 + auth5 + auth6 + auth7;
loadComments();
registerComment();
moreComment();

function loadComments() {
  fetch(githubUrl, {
    method: "GET",
    headers: {
      Authorization: "token " + auth,
    },
    cache: "no-store",
  })
    .then((res) => res.json())
    .then((comments) => {
      var url =
        githubUrl +
        "/issues?per_page=" +
        comments.open_issues +
        "&labels=guest_book";
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: "token " + auth,
        },
      })
        .then((res) => res.json())
        .then((comments) => {
          $("#guest_more_btn").hide();
          let commentList = document.getElementById("comment-list");
          for (let i in comments) {
            var display = "block";
            if (i >= 5) {
              display = "none";
              $("#guest_more_btn").show();
            }
            commentList.innerHTML += `
            <li class="comment" id="comment_${
              comments[i].number
            }" style="display: ${display}">
              <p class="name">${comments[i].title}</p>
              <p class="date">${comments[i].created_at
                .replace("T", "  ")
                .replace("Z", "")
                .slice(0, -9)}</p>
              <p class="memo">${comments[i].body}</p>
              <p class="del"><a href="#none" onclick="javascript:guestbook_del('${
                comments[i].number
              }', '${comments[i].labels[0].name}');">삭제</a></p>
            </li>`;
          }
        });
    });
}

function registerComment() {
  let commentRegistration = document.getElementById("comment-registration");
  commentRegistration.addEventListener("click", () => {
    let name = document.getElementById("comment-name");
    let msg = document.getElementById("comment-msg");
    let pwd = document.getElementById("comment-pwd");
    if (!name.value) {
      alert("이름을 입력해주세요!");
    } else if (!msg.value) {
      alert("축하 메시지를 입력해주세요!");
    } else if (!pwd.value) {
      alert("비밀번호를 입력해주세요!");
    } else {
      fetch(githubUrl + "/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "token " + auth,
        },
        body: JSON.stringify({
          title: name.value,
          body: msg.value,
          labels: [pwd.value, "guest_book"],
        }),
      })
        .then((res) => res.json())
        .then((comment) => {
          name.value = "";
          msg.value = "";
          pwd.value = "";
          let commentList = document.getElementById("comment-list");
          commentList.innerHTML =
            `
        <li class="comment" id="comment_${comment.number}">
          <p class="name">${comment.title}</p>
          <p class="date">${comment.created_at
            .replace("T", "  ")
            .replace("Z", "")
            .slice(0, -9)}</p>
          <p class="memo">${comment.body}</p>
          <p class="del"><a href="#none" onclick="javascript:guestbook_del('${
            comment.number
          }', '${comment.labels[0].name}');">삭제</a></p>
        </li>` + commentList.innerHTML;
        });
    }
  });
}

function moreComment() {
  let moreBtn = document.getElementById("guest_more_btn");
  moreBtn.addEventListener("click", () => {
    clicked = Number($("#guest_more_btn").data("clicked")) + 1;
    $("#guest_more_btn").data("clicked", clicked);
    i = 0;
    $(".comment").each(function () {
      i++;
      if (i < clicked * 5 + 1) $(this).show();
    });
    if (clicked * 5 + 1 >= $(".comment").length) {
      $("#guest_more_btn").fadeOut("slow");
    }
  });
}

var guestbook_del = function (issue_num, issue_pwd) {
  var password = prompt("비밀번호를 입력해주세요!");
  if (issue_pwd == password) {
    fetch(githubUrl + "/issues/" + issue_num, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "token " + auth,
      },
      body: JSON.stringify({
        state: "closed",
      }),
    })
      .then((res) => res.json())
      .then((comment) => {
        var id = "#comment_" + issue_num;
        $(id).remove();
      });
  } else if (password != null) {
    alert("비밀번호가 틀렸어요!");
  }
};

function registerRsvp(
  attend_type,
  attend_name,
  attender,
  attend_eat,
  attend_bus
) {
  //TODO: 유효성 검증
  if (!attend_type) {
    alert("구분을 선택해주세요.");
  } else {
    fetch(githubUrl + "/issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "token " + auth,
      },
      body: JSON.stringify({
        title: `참석여부 : ${attend_name}`,
        body: `구분 : ${attend_type}\n참석자 : ${attender}\n식사 : ${attend_eat}\n버스 : ${attend_bus}`,
        labels: ["rsvp"],
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        window.alert("참석의사 전달이 완료되었습니다.");
        $("input[name=attend_type]").val("");
        $("input[name=attend_name]").val("");
        $("input[name=attender]").val("");
        $("input[name=attend_eat]").val("");
        $("input[name=attend_bus]").val("");
        $("#attendRegisterModal").modal("hide");
      });
  }
}
