export const loadMaterialFonts = () => {
  const matIconsLink = document.head.querySelector('link[material-icons]');

  if (!matIconsLink) {
    const newLink = document.createElement('link');
    newLink.rel = 'stylesheet';
    newLink.href = 'https://fonts.googleapis.com/css?family=Material+Icons&display=block';
    newLink.toggleAttribute('material-icons', true);
    document.head.appendChild(newLink);
  }
}