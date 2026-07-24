export async function run(params) {
  const moduleI = await import(`${Utils.getBaseURL()}shared/js/item-list-controller.js`); 
  const moduleP = await import(`${Utils.getBaseURL()}shared/js/data-page-controller.js`); 
  const moduleCustom = await import(`${Utils.getBaseURL()}${params.script}`);
  
  const elemRef = {
    header:        document.querySelector(".itemlist__header"),
    title:         document.querySelector(".itemlist__title"),
    description:   document.querySelector(".itemlist__description"),
    customBlock:   document.querySelector(".itemlist__customblock"),
    itemContainer: document.querySelector("#DataContainer"),
  };

  const itemCtrl = new moduleI.ItemListCtrl({
    itemContainerElem: elemRef.itemContainer,
  });
  const pageCtrl = new moduleP.DataPageCtrl({
    headerElem: elemRef.header,
    titleElem:  elemRef.title,
    descElem:   elemRef.description,
    customElem: elemRef.customBlock,
    itemCtrl:   itemCtrl,
  });

  await moduleCustom.run(pageCtrl, params.params);
}