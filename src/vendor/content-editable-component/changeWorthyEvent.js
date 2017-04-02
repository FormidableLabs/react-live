export default e => e.type === "keyup" ? !e.key.match(/^\S$/) : true;
