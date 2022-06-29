function outsideClick(e) {
  if (e.target.closest(".modal-inner")) {
    return;
  }
  const modalVisible = document.querySelector(".modal-visible");
  if (modalVisible) {
    closeModal();
  }
}
function escKey(e) {
  if (e.keyCode == 27) {
    closeModal();
  }
}

function closeClick(e) {
  if (e.target.classList.contains("closeModal")) {
    closeModal();
  }
}
function trapTabKey(e) {
  const vanillaModal = document.querySelector(".vanilla-modal");
  const FOCUSABLE_ELEMENTS = [
    "a[href]",
    "area[href]",
    'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
    "select:not([disabled]):not([aria-hidden])",
    "textarea:not([disabled]):not([aria-hidden])",
    "button:not([disabled]):not([aria-hidden])",
    "iframe",
    "object",
    "embed",
    "[contenteditable]",
    '[tabindex]:not([tabindex^="-"])',
  ];

  const nodes = vanillaModal.querySelectorAll(FOCUSABLE_ELEMENTS);
  let focusableNodes = Array(...nodes);

  if (focusableNodes.length === 0) return;

  focusableNodes = focusableNodes.filter((node) => {
    return node.offsetParent !== null;
  });

  // if disableFocus is true
  if (!vanillaModal.contains(document.activeElement)) {
    focusableNodes[0].focus();
  } else {
    const focusedItemIndex = focusableNodes.indexOf(document.activeElement);

    if (e.shiftKey && focusedItemIndex === 0) {
      focusableNodes[focusableNodes.length - 1].focus();
      e.preventDefault();
    }

    if (
      !e.shiftKey &&
      focusableNodes.length > 0 &&
      focusedItemIndex === focusableNodes.length - 1
    ) {
      focusableNodes[0].focus();
      e.preventDefault();
    }
  }
}

function closeModal() {
  const vanillaModal = document.querySelector(".vanilla-modal");
  if (vanillaModal) {
    vanillaModal.classList.remove("modal-visible");
    document.getElementById("modal-content").innerHTML = "";
    document.getElementById("modal-content").style = "";
  }

  document.removeEventListener("keydown", escKey);
  document.removeEventListener("click", outsideClick, true);
  document.removeEventListener("click", closeClick);
  document.removeEventListener("keydown", trapTabKey);
}

const modal = {
  init: function () {
    const prerendredModal = document.createElement("div");
    prerendredModal.classList.add("vanilla-modal");
    const htmlModal = `         
         <div class="modal">
         <div class="modal-inner"
         ><div id="modal-content"></div></div></div>`;
    prerendredModal.innerHTML = htmlModal;
    document.body.appendChild(prerendredModal);
  },
  open: function (idContent, option = { default: null }) {
    let vanillaModal = document.querySelector(".vanilla-modal");
    if (!vanillaModal) {
      console.log("there is no vanilla modal class");
      modal.init();
      vanillaModal = document.querySelector(".vanilla-modal");
    }

    const content = document.getElementById(idContent);
    let currentModalContent = content.cloneNode(true);
    currentModalContent.classList.add("current-modal");
    currentModalContent.style = "";
    document.getElementById("modal-content").appendChild(currentModalContent);

    if (!option.default) {
      if (option.width && option.height) {
        document.getElementById("modal-content").style.width = option.width;
        document.getElementById("modal-content").style.height = option.height;
      }
    }
    vanillaModal.classList.add("modal-visible");
    document.addEventListener("click", outsideClick, true);
    document.addEventListener("keydown", escKey);
    document.addEventListener("keydown", trapTabKey);
    document
      .getElementById("modal-content")
      .addEventListener("click", closeClick);
  },

  close: function () {
    closeModal();
  },
};

// for webpack es6 use uncomment the next line
// export default modal;

window.onload = function () {
  modal.init();
  document.querySelector(".openModal").addEventListener("click", function (e) {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var currentVariant = urlParams.get("variant");

    // use default variant
    if (currentVariant == undefined || currentVariant == "") {
      console.log(window.default_variant);
    } else {
      console.log(currentVariant);
      console.log(window.variants[currentVariant]);
    }

    modal.open("delete-record");
  });
};

// var previewFrame = document.getElementById("preview-btn-frame")
// var src = previewFrame.src
// previewFrame.src = src;

// function afterLoading(){
//   alert("I am here");
// }

// function checkIframeLoaded() {
//   // Get a handle to the iframe element
//   var iframe = document.getElementById('preview-btn-frame');
//   var src = iframe.src;
//   var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

//   // Check if loading is complete
//   if (  iframeDoc.readyState  == 'complete' ) {
//       //iframe.contentWindow.alert("Hello");
//       iframe.contentWindow.onload = function(){
//           alert("I am loaded");
//       };
//       // The loading is complete, call the function we want executed once the iframe is loaded
//       afterLoading();
//       return;
//   }

//   iframe.src = src;
//   console.log("Set iframe src: " + iframe.src)

//   // If we are here, it is not loaded. Set things up so we check   the status again in 100 milliseconds
//   window.setTimeout(checkIframeLoaded, 100);
// }

// window.addEventListener("load", function() {

//   var openModal = document.getElementById("openModal");

//   openModal.addEventListener("click", function() {
//     alert()
//     var iframe = document.getElementById('preview-btn-frame');
//     var src = iframe.src;

//     iframe.src = src;
//   })

// })

// // checkIframeLoaded()
