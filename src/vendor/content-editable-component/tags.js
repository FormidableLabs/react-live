export const htmlToTags = html => {
  let foundTag;
  const foundTags = [];
  const re = /<\/?.+?>/gm;
  let tagWidthSum = 0;

  while ((foundTag = re.exec(html)) !== null) {
    foundTags.push({
      tag: foundTag[0],
      index: foundTag.index - tagWidthSum
    });

    tagWidthSum += foundTag[0].length;
  }

  const parsedTags = foundTags
    .map(({ tag, index }) => {
      let tagAttr;
      const tagAttrs = [];
      const reAttrs = /([^ ]+ ?= ?[^ ]+)|(\/?\w+)/gm;

      while ((tagAttr = reAttrs.exec(tag.slice(1, -1))) !== null) {
        tagAttrs.push(tagAttr[0]);
      }

      const tagJSON = {
        type: tagAttrs[0],
        index: index
      };

      if (tagAttrs.length > 1) {
        tagJSON.attrs = tagAttrs.slice(1);
      }

      return tagJSON;
    })
    .filter(tag => !tag.type.match(/\/?div/))
    .filter(tag => !tag.type.match(/\/?br/));

  return parsedTags;
};

export const addTagsToPlain = (plain, tags_) => {
  const tags = tags_.concat().sort((lhs, rhs) => lhs.index < rhs.index);

  let returnAcc = plain;

  tags.map(tag => {
    const tags = (tag.attrs || []).join(" ");
    const tagStr = "<" + tag.type + (tags ? " " + tags : "") + ">";
    returnAcc = returnAcc.substr(0, tag.index) +
      tagStr +
      returnAcc.substr(tag.index);
  });

  return returnAcc;
};
