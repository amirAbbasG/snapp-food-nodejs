const successPayment = (payment) => {
    return "<div class=\"container\">\n" +
        "   <div class=\"row\">\n" +
        "      <div class=\"col-md-6 mx-auto mt-5\">\n" +
        "         <div class=\"payment\">\n" +
        "            <div class=\"payment_header\">\n" +
        "               <div class=\"check\"><i class=\"fa fa-check\" aria-hidden=\"true\"></i></div>\n" +
        "            </div>\n" +
        "            <div class=\"content\">\n" +
        "               <h1>پرداخت موفقیت آمیز</h1>\n" +
        "               <p id='refId'></p>\n" +
        "               <a href=\"http://localhost:3000\">بازگشت به اسنپ فود</a>\n" +
        "            </div>\n" +
        "            \n" +
        "         </div>\n" +
        "      </div>\n" +
        "   </div>\n" +
        "</div>" +
        "<link rel=\"stylesheet\" type=\"text/css\" href=\"https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css\" />\n" +
        "<link rel=\"stylesheet\" type=\"text/css\" href=\"https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css\" />\n" +
        "<style type=\"text/css\">\n" +
        "\n" +
        "    body\n" +
        "    {\n" +
        "        background:#f2f2f2;\n" +
        "    }\n" +
        "\n" +
        "    .payment\n" +
        "\t{\n" +
        "\t\tborder:1px solid #f2f2f2;\n" +
        "\t\theight:280px;\n" +
        "        border-radius:20px;\n" +
        "        background:#fff;\n" +
        "\t}\n" +
        "   .payment_header\n" +
        "   {\n" +
        "\t   background: green;\n" +
        "\t   padding:20px;\n" +
        "       border-radius:20px 20px 0px 0px;\n" +
        "\t   \n" +
        "   }\n" +
        "   \n" +
        "   .check\n" +
        "   {\n" +
        "\t   margin:0px auto;\n" +
        "\t   width:50px;\n" +
        "\t   height:50px;\n" +
        "\t   border-radius:100%;\n" +
        "\t   background:#fff;\n" +
        "\t   text-align:center;\n" +
        "   }\n" +
        "   \n" +
        "   .check i\n" +
        "   {\n" +
        "\t   vertical-align:middle;\n" +
        "\t   line-height:50px;\n" +
        "\t   font-size:30px;\n" +
        "   }\n" +
        "\n" +
        "    .content \n" +
        "    {\n" +
        "        text-align:center;\n" +
        "    }\n" +
        "\n" +
        "    .content  h1\n" +
        "    {\n" +
        "        font-size:25px;\n" +
        "        padding-top:25px;\n" +
        "    }\n" +
        "\n" +
        "    .content a\n" +
        "    {\n" +
        "        width:200px;\n" +
        "        height:35px;\n" +
        "        color:#fff;\n" +
        "        border-radius:30px;\n" +
        "        padding:5px 10px;\n" +
        "        background: green;\n" +
        "        transition:all ease-in-out 0.3s;\n" +
        "    }\n" +
        "\n" +
        "    .content a:hover\n" +
        "    {\n" +
        "        text-decoration:none;\n" +
        "        background:#000;\n" +
        "    }\n" +
        "   \n" +
        "</style>" +
        "<script>\n" +
        "document.getElementById(\"refId\").innerHTML = payment.refId;\n" +
        "</script>\n"
}


module.exports = successPayment
