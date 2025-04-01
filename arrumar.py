from flask import Flask, request, jsonify
import requests
import hashlib
import hmac

app = Flask(__name__)

# Substitua com suas chaves do PicPay
PICPAY_TOKEN = "SUA_CHAVE_PICPAY_TOKEN"
SELLER_TOKEN = "SUA_CHAVE_SELLER_TOKEN"

@app.route('/gerar-qr-code-picpay', methods=['POST'])
def gerar_qr_code_picpay():
    try:
        dados = request.get_json()
        valor = dados.get('valor')
        reference_id = dados.get('referenceId')

        url = "https://appws.picpay.com/ecommerce/public/payments"
        headers = {
            "Content-Type": "application/json",
            "x-picpay-token": PICPAY_TOKEN
        }
        payload = {
            "referenceId": reference_id,
            "value": valor,
            "callbackUrl": "SUA_URL_DE_CALLBACK", # URL para receber notificações
            "returnUrl": "SUA_URL_DE_RETORNO" # URL para redirecionar o usuário
        }

        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status() # Lança exceção para erros HTTP

        data = response.json()
        return jsonify({"qrCodeImage": data["qrcode"]["base64"]})

    except requests.exceptions.RequestException as e:
        print(f"Erro ao gerar QR Code: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/picpay/notificacao', methods=['POST'])
def picpay_notificacao():
    try:
        dados = request.get_json()
        reference_id = dados.get('referenceId')
        authorization_id = dados.get('authorizationId')
        status = dados.get('status')
        signature = request.headers.get('x-picpay-signature')

        string_to_sign = f"{reference_id}{authorization_id}{status}"
        expected_signature = hmac.new(
            SELLER_TOKEN.encode('utf-8'),
            string_to_sign.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        if signature == expected_signature:
            if status == "paid":
                print(f"Pedido {reference_id} pago com sucesso!")
                return jsonify({"status": "OK"}), 200
            else:
                print(f"Pedido {reference_id} com status: {status}")
                return jsonify({"status": "OK"}), 200
        else:
            print("Assinatura inválida!")
            return jsonify({"status": "Assinatura inválida"}), 400

    except Exception as e:
        print(f"Erro ao processar notificação: {e}")
        return jsonify({"status": "Erro"}), 500

@app.route('/verificar-status-pagamento', methods=['POST'])
def verificar_status_pagamento():
    try:
        dados = request.get_json()
        reference_id = dados.get('referenceId')

        url = f"https://appws.picpay.com/ecommerce/public/payments/{reference_id}/status"
        headers = {
            "x-picpay-token": PICPAY_TOKEN
        }

        response = requests.get(url, headers=headers)
        response.raise_for_status()

        data = response.json()
        return jsonify({"status": data["status"]})

    except requests.exceptions.RequestException as e:
        print(f"Erro ao verificar status do pagamento: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)