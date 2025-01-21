export const console_yaml = `
openapi: "3.0.2"
info:
  title: "运维API"
  description: "**Nacos 运维 aaAPI**"
  version: "3.0.0-beta"
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0
paths:
  /v3/admin/core/ops/raft:
    post:
      security:
        - bearerAuth: []
        - basicAuth: []
      summary: "执行raft命令"
      operationId: "raftOps"
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/RaftCommandForm"
        required: true
      responses:
        "200":
          description: "OK"
          content:
            'application/json':
              schema:
                $ref: "#/components/schemas/Result"

  /v3/admin/core/ops/ids:
    get:
      summary: "获取ID生成器信息"
      operationId: "ids"
      responses:
        "200":
          description: "OK"
          content:
            'application/json':
              schema:
                type: "array"
                items:
                  $ref: "#/components/schemas/IdGeneratorVO"
                  example:
                      - resource: "config-history-gray-id"
                        info:
                          currentId: 1
                          workerId: 1
  /v3/admin/core/ops/log:
    put:
      summary: "动态修改Nacos Core相关日志级别"
      operationId: "updateLog"
      requestBody:
        content:
          'application/json':
            schema:
              $ref: "#/components/schemas/LogUpdateRequest"
        required: true
      responses:
        "200":
          description: "OK"
          content:
            'application/json':
              schema:
                $ref: "#/components/schemas/Void"
  /v3/admin/core/cluster/node/self:
    get:
      summary: "获取本节点信息"
      operationId: "self"
      responses:
        "200":
          description: "OK"
          content:
            'application/json':
              schema:
                $ref: "#/components/schemas/Member"
  /v3/admin/core/cluster/node/list:
    get:
      summary: "获取集群所有节点信息"
      operationId: "listNodes"
      parameters:
        - name: "address"
          in: "query"
          required: false
          schema:
            type: "string"
        - name: "state"
          in: "query"
          required: false
          schema:
            type: "string"
      responses:
        "200":
          description: "OK"
          content:
            'application/json':
              schema:
                type: "array"
                items:
                  $ref: "#/components/schemas/Member"
    put:
      summary: "修改指定节点的状态"
      operationId: "updateNodes"
      requestBody:
        content:
          application/json:
            schema:
              type: "array"
              items:
                $ref: "#/components/schemas/Member"
        required: true
      responses:
        "200":
          description: "OK"
          content:
            'application/json':
              schema:
                type: "boolean"
  /v3/admin/core/cluster/node/self/health:
    get:
      summary: "快速查询本节点健康状态"
      operationId: "selfHealth"
      responses:
        "200":
          description: "OK"
          content:
            'application/json':
              schema:
                type: "string"
  /v3/admin/core/cluster/lookup:
    put:
      summary: "动态修改Server集群地址发现方式"
      operationId: "updateLookup"
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/LookupUpdateRequest"
        required: true
      responses:
        "200":
          description: "OK"
          content:
            'application/json':
              schema:
                type: "boolean"
  /v3/admin/core/loader/current:
    get:
      summary: "获取当前节点连接"
      operationId: "currentClients"
      responses:
        "200":
          description: "OK"
          content:
            'application/json':
              schema:
                type: "object"
                example:
                  1734953297217_192.168.1.6_41380:
                    traced: false
                    abilityTable: { }
                    metaInfo:
                      connectType: GRPC
                      clientIp: 192.168.1.6
                      remoteIp: 192.168.1.6
                      remotePort: 41380
                      localPort: 9849
                      version: Nacos-Java-Client:v2.4.3
                      connectionId: 1734953297217_192.168.1.6_41380
                      createTime: '2024-12-23T11:28:17.239+00:00'
                      lastActiveTime: 1734957195739
                      appName: "-"
                      tenant:
                      labels:
                        source: cluster
                        tls.enable: 'false'
                      tag:
                      clusterSource: true
                      sdkSource: false
                      appLabels:
                        ClientVersion: Nacos-Java-Client:v2.4.3
                        AppName: null
                    connected: true
                    labels:
                      source: cluster
                      tls.enable: 'false'
                    appLabels:
                      ClientVersion: Nacos-Java-Client:v2.4.3
                      AppName: null
                  1734953297217_192.168.1.6_41388:
                    traced: false
                    abilityTable: { }
                    metaInfo:
                      connectType: GRPC
                      clientIp: 192.168.1.6
                      remoteIp: 192.168.1.6
                      remotePort: 41388
                      localPort: 9849
                      version: Nacos-Java-Client:v2.4.3
                      connectionId: 1734953297217_192.168.1.6_41388
                      createTime: '2024-12-23T11:28:17.239+00:00'
                      lastActiveTime: 1734957197826
                      appName: "-"
                      tenant:
                      labels:
                        source: cluster
                        tls.enable: 'false'
                      tag:
                      clusterSource: true
                      sdkSource: false
                      appLabels:
                        ClientVersion: Nacos-Java-Client:v2.4.3
                        AppName:
                    connected: true
                    labels:
                      source: cluster
                      tls.enable: 'false'
                    appLabels:
                      ClientVersion: Nacos-Java-Client:v2.4.3
                      AppName: null
  /v3/admin/core/loader/reloadCurrent:
    get:
      summary: "均衡指定数量的连接"
      operationId: "reloadCount"
      parameters:
        - name: "count"
          in: "query"
          required: true
          schema:
            type: "integer"
            format: "int32"
        - name: "redirectAddress"
          in: "query"
          required: false
          schema:
            type: "string"
      responses:
        "200":
          description: "OK"
          content:
            'application/json':
              schema:
                type: "string"
  /v3/admin/core/loader/smartReloadCluster:
    get:
      summary: "自动均衡指定数量的连接"
      operationId: "smartReload"
      parameters:
        - name: "loaderFactor"
          in: "query"
          required: false
          schema:
            type: "string"
            default: "0.1f"
      responses:
        "200":
          description: "OK"
          content:
            'application/json':
              schema:
                $ref: '#/components/schemas/Void'
  /v3/admin/core/loader/reloadClient:
    get:
      summary: "均衡指定的单个连接"
      operationId: "reloadSingle"
      parameters:
        - name: "connectionId"
          in: "query"
          required: true
          schema:
            type: "string"
        - name: "redirectAddress"
          in: "query"
          required: false
          schema:
            type: "string"
      responses:
        "200":
          description: "OK"
          content:
            'application/json':
              schema:
                $ref: '#/components/schemas/Void'
  /v3/admin/core/loader/cluster:
    get:
      summary: "获取集群连接概览信息"
      operationId: "loaderMetrics"
      responses:
        "200":
          description: "OK"
          content:
            'application/json':
              schema:
                $ref: "#/components/schemas/ServerLoaderMetrics"
components:
  schemas:
    IdInfo:
      type: "object"
      properties:
        currentId:
          type: "integer"
          format: "int64"
        workerId:
          type: "integer"
          format: "int64"
    IdGeneratorVO:
      type: "object"
      properties:
        resource:
          type: "string"
        info:
          $ref: "#/components/schemas/IdInfo"
      example:
        resource: "config-history-gray-id"
        info:
          currentId: 1
          workerId: 1
    LogUpdateRequest:
      type: "object"
      properties:
        logName:
          type: "string"
          enum:
            - "core-auth"
            - "core"
            - "core-raft"
            - "core-distro"
            - "core-cluster"
        logLevel:
          type: "string"
          enum:
            - "ALL"
            - "TRACE"
            - "DEBUG"
            - "INFO"
            - "WARN"
            - "ERROR"
            - "OFF"
    Void:
      type: "object"
      properties: { }
    ServerRemoteAbility:
      type: "object"
      properties:
        supportRemoteConnection:
          type: "boolean"
        grpcReportEnabled:
          type: "boolean"
    ServerConfigAbility:
      type: "object"
      properties:
        supportRemoteMetrics:
          type: "boolean"
    ServerNamingAbility:
      type: "object"
      properties:
        supportJraft:
          type: "boolean"
    ServerAbilities:
      type: "object"
      properties:
        remoteAbility:
          $ref: "#/components/schemas/ServerRemoteAbility"
        configAbility:
          $ref: "#/components/schemas/ServerConfigAbility"
        namingAbility:
          $ref: "#/components/schemas/ServerNamingAbility"
    Member:
      type: "object"
      properties:
        ip:
          type: "string"
        port:
          type: "integer"
          format: "int32"
        state:
          type: "string"
          enum:
            - "STARTING"
            - "UP"
            - "SUSPICIOUS"
            - "DOWN"
            - "ISOLATION"
        extendInfo:
          type: "object"
          properties:
            lastRefreshTime:
              type: "integer"
              format: "int32"
            raftMetaData:
              type: "object"
              properties:
                metaDataMap:
                  type: "object"
            raftPort:
              type: "string"
            readyToUpgrade:
              type: boolean
            supportGrayModel:
              type: boolean
            version:
              type: "string"
        address:
          type: "string"
        failAccessCnt:
          type: "integer"
          format: "int32"
        abilities:
          $ref: "#/components/schemas/ServerAbilities"
        grpcReportEnabled:
          type: "boolean"
      example:
        ip: "192.168.1.3"
        port: 8848
        state: "UP"
        extendInfo:
          lastRefreshTime: 1734953294920
          raftMetaData:
            metaDataMap:
              naming_instance_metadata:
                leader: "192.168.1.6:7848"
                raftGroupMember:
                  - "192.168.1.3:7848"
                  - "192.168.1.6:7848"
                term: 8
              naming_persistent_service:
                leader: "192.168.1.6:7848"
                raftGroupMember:
                  - "192.168.1.3:7848"
                  - "192.168.1.6:7848"
                term: 13
              naming_persistent_service_v2:
                leader: "192.168.1.6:7848"
                raftGroupMember:
                  - "192.168.1.3:7848"
                  - "192.168.1.6:7848"
                term: 8
              naming_service_metadata:
                leader: "192.168.1.6:7848"
                raftGroupMember:
                  - "192.168.1.3:7848"
                  - "192.168.1.6:7848"
                term: 8
          raftPort: '7848'
          readyToUpgrade: true
          supportGrayModel: true
          version: "3.0.0-ALPHA"
        address: "192.168.1.3:8848"
        failAccessCnt: 0
        abilities:
          remoteAbility:
            supportRemoteConnection: true
            grpcReportEnabled: true
          configAbility:
            supportRemoteMetrics: false
          namingAbility:
            supportJraft: true
        grpcReportEnabled: true
    LookupUpdateRequest:
      type: "object"
      properties:
        type:
          type: "string"
    ServerLoaderMetric:
      type: "object"
      properties:
        address:
          type: "string"
        sdkConCount:
          type: "integer"
          format: "int32"
        conCount:
          type: "integer"
          format: "int32"
        load:
          type: "string"
        cpu:
          type: "string"
    ServerLoaderMetrics:
      type: "object"
      properties:
        detail:
          type: "array"
          items:
            $ref: "#/components/schemas/ServerLoaderMetric"
        memberCount:
          type: "integer"
          format: "int32"
        metricsCount:
          type: "integer"
          format: "int32"
        completed:
          type: "boolean"
        max:
          type: "integer"
          format: "int32"
        min:
          type: "integer"
          format: "int32"
        avg:
          type: "integer"
          format: "int32"
        threshold:
          type: "string"
        total:
          type: "integer"
          format: "int32"
    RaftCommandForm:
      type: "object"
      properties:
        groupId:
          type: "string"
        command:
          type: "string"
          example: "transferLeader"
          enum: ["transferLeader","doSnapshot","resetRaftCluster","removePeer"]
        value:
          type: "string"
          example: "127.0.0.1:7848"
      required:
        - "command"
        - "value"
    Result:
      type: "object"
      properties:
        code:
          type: "integer"
          format: "int32"
          example: 200
        message:
          type: "string"
          example: "success"
#        data:
#          description: Generic data field
#          nullable: true
#          oneOf:
#            - $ref: '#/components/schemas/ServerLoaderMetrics'
#            - type: "string"
#          discriminator:
#            propertyName: "type"
#            mapping:
#              "ServerLoaderMetrics": "#/components/schemas/ServerLoaderMetrics"
      required:
        - "code"
        - "message"
  securitySchemes:
    "bearerAuth":
      type: "http"
      scheme: "bearer"
      "bearerFormat": "jwt"
      "description": "note: non-oauth scopes are not defined at the securityScheme level"
    "basicAuth":
      type: "http"
      scheme: "basic"
#tags:
#security:
#externalDocs:
`;