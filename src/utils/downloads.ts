export const saveData = (function () {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.setAttribute('style', "display: none")
  return function (data: string, fileName: string) {
    const blob = new Blob([data], {type: "octet/stream"})
    const url = window.URL.createObjectURL(blob)
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
})();

export {}
