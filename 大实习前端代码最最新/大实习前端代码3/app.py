from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import logging
import json

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False  # 禁用ASCII编码，允许直接显示中文
CORS(app)


# PostgreSQL 连接配置（根据你实际情况修改）
conn = psycopg2.connect(
    dbname='fvcdb',
    user='postgres',
    password='123456',
    host='192.168.89.206',
    port='5432'
)

@app.route('/api/climate_data', methods=['GET'])
def get_climate_data():
    region_name = request.args.get('region_name', default='昆明市')
    with conn.cursor() as cur:
        cur.execute("""
            SELECT year, temp_mean, pre_mean
            FROM temppredb
            WHERE region_name = %s
            ORDER BY year ASC
        """, (region_name,))
        rows = cur.fetchall()

    data = [
        {"year": row[0], "temp_mean": row[1], "pre_mean": row[2]}
        for row in rows
    ]
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
