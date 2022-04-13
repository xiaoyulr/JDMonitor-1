// 京东口令
// [rule: raw [\s\S]*^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?[\s\S]*]

var url = param(1);

function main() {
    sendText(url)
}

main()
