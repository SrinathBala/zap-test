import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class DockerTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const defaultVpc = ec2.Vpc.fromLookup(this, 'DefaultVpc', {
      isDefault: true
    });

    const webserverSG = new ec2.SecurityGroup(this, 'webserver-sg', {
      vpc: defaultVpc,
      allowAllOutbound: true,
    });

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'allow SSH access from anywhere',
    );

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'allow HTTP traffic from anywhere',
    );

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'allow HTTPS traffic from anywhere',
    );

    webserverSG.addEgressRule(ec2.Peer.ipv4('0.0.0.0/0'), ec2.Port.tcp(-1));

    const githubUrl = "https://github.com/SrinathBala/zap-flask.git";

    const ec2Instance = new ec2.Instance(this, 'ec2-instance', {
      securityGroup: webserverSG,
      vpc: defaultVpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO,
      ),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName: 'devops',
      userData:  ec2.UserData.custom("#!/bin/bash\nsudo -i\nyum update -y\nyum install python3-pip git -y\nsudo git clone git clone ${githubUrl}\nsudo pip3 install flask\ncd zap-flask\npython3 app.py\n")
    });

  }
}
