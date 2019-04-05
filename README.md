# Distributed System

This project wants to be an help for me to learn and improve some concepts related to distributed systems and the most useful patterns used in complex architectures.

## System Explained

The system is composed of 3 services:

- dashboard: the front end application for inserting and showing data.
- write-side: the service the handles the incoming requests (insert commands) from the front end.
- read-side: the service the handles the outcoming queries (get commands) to the front end.

The final goal is to have a system that can run on containers orchestrated by Kubernetes.
Through the dashboard will be possible to manage data and stop some services in order to see what happens to the system and its consistency.

### Architecture

The following picture shows the flow of the data through main components

![architecture](assets/images/architecture.jpg)

#### First Version Sequence Diagram

The following picture shows the sequence diagram for add command of the first version of the system, in which all components are supposed to be up without problem during the execution.

![v1sequencediagram](assets/images/first_version_sequence_diagram.jpg)

## References

## DDD

- https://exceptionnotfound.net/real-world-cqrs-es-with-asp-net-and-redis-part-1-overview/

### Command, CommandHandler and CommandBus

- https://culttt.com/2014/11/10/creating-using-command-bus/

- https://github.com/erickjth/simple-command-bus

- http://cqrs.nu/Faq/command-handlers

- https://enterprisecraftsmanship.com/2019/02/20/validate-commands-cqrs/

### CQRS

- https://watermill.io/docs/cqrs/

### Event Sourcing

- https://blog.risingstack.com/event-sourcing-with-examples-node-js-at-scale/

- https://xebia.com/blog/cqrs-designing-the-event-store/

- https://github.com/speedment/speedment/wiki/Tutorial:-Create-an-Event-Sourced-System

- https://blog.sebastian-daschner.com/entries/event_sourcing_cqrs_video_course

### Miscellaneous

- https://rfvallina.com/blog/2015/11/12/share-private-node-dot-js-modules-across-applications-locally.html

- https://www.twilio.com/blog/2017/06/writing-a-node-module-in-typescript.html