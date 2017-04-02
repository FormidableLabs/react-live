import { htmlToPlain } from "./plainContent";
import { htmlToTags, addTagsToPlain } from "./tags";

// keys of state: selection and html
export default (state, action) => {
  console.log(
    "SEL from " + state.selection.start + " to " + state.selection.end
  );

  if (state.selection.start - state.selection.end === 0) {
    console.error("nothing selected");
    // return state;
  }
  const formatTag = action.tag;
  if (!formatTag) {
    console.error("action is shit");

    return state;
  }

  const selStart = state.selection.start;
  const selEnd = state.selection.end;

  const prevState = Object.assign({}, state);
  const nextState = Object.assign({}, state);

  const prevPlain = htmlToPlain(prevState.html || "");
  const prevTags = htmlToTags(prevState.html || "");

  prevTags.sort(function(a, b) {
    return Number(a.index > b.index) || Number(a.index === b.index) - 1;
  });

  const tags = prevTags.filter(function(tag) {
    return tag.type.replace("/", "") === formatTag;
  });
  const irrelevantTags = prevTags.filter(function(tag) {
    return tag.type.replace("/", "") !== formatTag;
  });

  console.log("tags", tags);

  const bitArray = new Array(prevPlain.length);

  // MAKE BIT ARRAY

  const tagsLookup = {};
  tags.map(function(tag) {
    if (tag.type === formatTag) {
      tag.format = true;
    } else if (tag.type === "/" + formatTag) {
      tag.format = false;
    } else {
      console.error("tag has unexpected type");

      return prevState;
    }
    tagsLookup[tag.index.toString()] = tag;
  });

  const lookupTag = function(index) {
    return tagsLookup[index.toString()];
  };

  let isFormatted = false;

  for (let j = 0; j < bitArray.length; j++) {
    if (lookupTag(j)) {
      if (lookupTag(j).format === isFormatted) {
        console.error("tags are fucked");
        //return prevState;
      } else {
        isFormatted = !isFormatted;
      }
    }
    bitArray[j] = isFormatted;
  }

  let logStr = "";
  bitArray.map(function(b) {
    logStr = logStr.concat(Number(b));
  });
  // console.log(bitArray);
  console.log(logStr);
  console.log(prevPlain);
  console.log("\n");

  // APPLY FORMATTING

  let toFormat = false;
  for (let j = selStart; j < selEnd; j++) {
    if (bitArray[j] === false) {
      toFormat = true;
      break;
    }
  }

  for (let j = selStart; j < selEnd; j++) {
    bitArray[j] = toFormat;
  }

  // TURN ARRAY INTO TAGS

  const freshTags = [];
  let prevFormat = false;
  for (let j = 0; j < bitArray.length; j++) {
    if (bitArray[j] !== prevFormat) {
      freshTags.push({
        type: (bitArray[j] ? "" : "/") + formatTag,
        index: j
      });
    }
    prevFormat = bitArray[j];
  }

  // MAKE EVERYTHING NICE AND RETURN STATE

  const nextTags = [].concat(irrelevantTags, freshTags);
  nextTags.sort(function(a, b) {
    return Number(a.index > b.index) || Number(a.index === b.index) - 1;
  });

  nextState.html = addTagsToPlain(prevPlain, nextTags || []);
  console.log(nextState.html);

  const el = document.createElement("span");
  el.innerHTML = nextState.html;
  nextState.html = el.innerHTML;

  console.log(nextState.html);
  console.log("\n");

  return nextState;
};
