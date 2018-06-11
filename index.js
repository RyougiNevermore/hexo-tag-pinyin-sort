var pinyin = require("pinyin");

// sort tags by pinyin, return tag grouped by tag pinyin.
hexo.extend.generator.register('tag', function(locals){
    var tags = locals.tags;
    var sortedTags = Array(tags.length);
    tags.forEach(function (tag, i) {
        pyHead = pinyin(tag.name, {
            style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
            heteronym: false
        })[0][0][0].toUpperCase();
        sortedTags.push({'pyHead':pyHead, 'tag':tag});
    });
    sortedTags.sort(function (aTag, bTag) {
        var a = aTag.pyHead;
        var b = bTag.pyHead;
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    });
    var groupTags = new Array();
    var groupName = '';
    var groupIndex = -1;
    sortedTags.forEach(function (tag, index) {
        if (tag.pyHead === undefined || tag.pyHead === '') {
            tag.pyHead = '#';
        }
        var item = null;
        if (tag.pyHead !== groupName) {
            groupName = tag.pyHead;
            groupIndex ++;
            item = {'name': groupName, list: []};
        } else {
            item = groupTags[groupIndex];
        }
        item.list.push(tag.tag);
        groupTags[groupIndex] = item;
    });
    // move '#' to end of group.
    groupTags.sort(function (a, b) {
        if (a.name === '#') {
            return 1;
        }
        if (b.name === '#') {
            return -1;
        }
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
    return {
        path: 'tags/index.html',
        data: {'tags':locals.tags, 'groupTags':groupTags},
        layout: ['tag', 'index']
    }
});