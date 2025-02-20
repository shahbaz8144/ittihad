$(function() {
    $('.vertical-tree ul').hide();
    $('.vertical-tree>ul').show();
    $('.vertical-tree ul.active').show();
    $('.vertical-tree li').on('dblclick', function(e) {
        var children = $(this).find('> ul');
        if (children.is(":visible")) children.hide('fast').removeClass('active');
        else children.show('fast').addClass('active');
        e.stopPropagation();
    });
});